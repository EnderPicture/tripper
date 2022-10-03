<script lang="ts">
	import {
		events,
		eIdToI,
		MINUTES_HOUR,
		overDaySlotElement,
		draggedEvent,
		zoom,
		type IItinerary,
		type IEvent,
		type IEventID,
		type ISimpleEvent,
		type ITravelTime
	} from '$lib/store';
	import EventBlock from '$lib/components/event-block.svelte';
	import { identity } from 'svelte/internal';
	import { sleep } from '$lib/util';
	import type { RouteResponse } from '$lib/api-types/routing';
	import TravelTime from './travel-time.svelte';

	export let itinerary: IItinerary;
	let slotElement: HTMLElement;

	enum OnTopOfType {
		start,
		mid,
		end
	}

	let onTopOf: OnTopOfType = OnTopOfType.mid;

	$: startTime = itinerary.startTime;
	$: endTime = itinerary.endTime;

	$: numberOfHours = (endTime - startTime) / MINUTES_HOUR + 1;
	$: offsetHours = startTime / MINUTES_HOUR;
	$: height = (endTime - startTime) * $zoom;

	const onPointerOver = (e: PointerEvent, onTopOfCurrent: OnTopOfType) => {
		onTopOf = onTopOfCurrent;
		$overDaySlotElement = {
			slotData: itinerary,
			element: slotElement
		};
	};
	const onPointerLeave = () => {
		$overDaySlotElement = null;
	};
	const onPointerUp = (e: PointerEvent) => {
		if ($draggedEvent !== null) {
			// og event card offset calc, mouse did not click at the center of the card
			const yCenterPercent =
				(($draggedEvent.pointerEvent.clientY - $draggedEvent.boundingRect.y) /
					$draggedEvent.boundingRect.height) *
				100;
			const offsetY = (yCenterPercent / 100) * MINUTES_HOUR * $zoom;

			const box = slotElement.getBoundingClientRect();
			const start = itinerary.startTime + e.clientY - box.y - offsetY;
			const end = start + MINUTES_HOUR;

			deleteIfExists($draggedEvent.eventId);

			if (onTopOf === OnTopOfType.mid) {
				$events[$eIdToI[$draggedEvent.eventId]].plan = {
					itineraryId: itinerary.id,
					startTime: start,
					endTime: end
				};

				itinerary.eventIds.push($draggedEvent.eventId);
				itinerary = itinerary;
			} else if (onTopOf === OnTopOfType.start) {
				$events[$eIdToI[$draggedEvent.eventId]].plan = {
					itineraryId: itinerary.id,
					startTime: Infinity,
					endTime: itinerary.startTime
				};

				itinerary.startEvent = $draggedEvent.eventId;
			} else if (onTopOf === OnTopOfType.end) {
				$events[$eIdToI[$draggedEvent.eventId]].plan = {
					itineraryId: itinerary.id,
					startTime: itinerary.endTime,
					endTime: -Infinity
				};

				itinerary.endEvent = $draggedEvent.eventId;
			}
		}
	};

	const deleteIfExists = (idToBeDeleted: IEventID) => {
		let idInList = itinerary.eventIds.findIndex((id) => id === idToBeDeleted);
		if (idInList >= 0) {
			itinerary.eventIds.splice(idInList, 1);
			itinerary = itinerary;
		} else if (itinerary.startEvent === idToBeDeleted) {
			itinerary.startEvent = null;
		} else if (itinerary.endEvent === idToBeDeleted) {
			itinerary.endEvent = null;
		}
	};

	const calcTravelTime = () => {
		const simpleEvents = itinerary.eventIds
			.reduce((locTiming, id) => {
				const event = $events[$eIdToI[id]];
				if (event.plan) {
					locTiming.push({
						eventId: event.id,
						start: event.plan.startTime,
						end: event.plan.endTime,
						cords: event.location?.cords ?? null
					});
				}

				return locTiming;
			}, [] as ISimpleEvent[])
			.sort((a, b) => a.start + (a.end - a.start) / 2 - b.start + (b.end - b.start) / 2);

		const fetchRoute = async (events: ISimpleEvent[]) => {
			// TODO: use cache if got it
			itinerary.travelTimes = [];

			for (let i = 0; i < events.length - 1; i++) {
				const eventA = events[i];
				const eventB = events[i + 1];

				if (eventA.cords && eventB.cords) {
					const res = await fetch(
						`https://routing.openstreetmap.de/routed-car/route/v1/driving/${eventA.cords.lon},${eventA.cords.lat};${eventB.cords.lon},${eventB.cords.lat}`
					);
					const json = (await res.json()) as RouteResponse;
					if (itinerary.travelTimes) {
						itinerary.travelTimes.push({
							startEventId: eventA.eventId,
							endEventId: eventB.eventId,
							duration: json.routes[0].duration,
							distance: json.routes[0].distance
						});
						itinerary = itinerary;
					}
				}

				await sleep(1000);
			}
		};

		fetchRoute(simpleEvents);
	};
</script>

<section>
	<div class="main">
		<div
			class="start"
			on:pointerenter={(e) => onPointerOver(e, OnTopOfType.start)}
			on:pointerleave={onPointerLeave}
			on:pointerup={onPointerUp}
		>
			<p>start</p>
			<button on:click={calcTravelTime}>show travel time</button>
		</div>
		<div
			class="container"
			style={`height: ${height}px`}
			on:pointerenter={(e) => onPointerOver(e, OnTopOfType.mid)}
			on:pointerleave={onPointerLeave}
			on:pointerup={onPointerUp}
			bind:this={slotElement}
		>
			<div class="events">
				{#each itinerary.eventIds as eventId}
					<EventBlock bind:event={$events[$eIdToI[eventId]]} dayStartTime={itinerary.startTime} />
				{/each}
			</div>
			<TravelTime {itinerary} />
			<div class="markers">
				{#each Array(numberOfHours) as _, count}
					<p style={`transform: translateY(${count * MINUTES_HOUR * $zoom}px)`}>
						{offsetHours + count}
					</p>
				{/each}
			</div>
		</div>
		<div
			class="end"
			on:pointerenter={(e) => onPointerOver(e, OnTopOfType.end)}
			on:pointerleave={onPointerLeave}
			on:pointerup={onPointerUp}
		>
			<p>end</p>
		</div>
	</div>
</section>

<style lang="scss">
	section {
		margin: 5rem 0;
		width: 30rem;
		padding-left: 3rem;
		padding-right: 0.5rem;
	}
	.main {
		background-color: darken($color2, 15);
		border-radius: 1rem;
		box-shadow: 0 0 20px #0002;
	}
	.container {
		display: block;
		background-image: linear-gradient(0deg, darken($color2, 5) 50%, darken($color2, 10) 50%);
		background-size: 1px 120px;
		width: 100%;
	}
	.markers {
		position: relative;
	}
	.markers > p {
		height: 2rem;
		position: absolute;
		top: -1rem;
		right: 100%;
		margin: 0;
		color: white;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		color: $color1;
		width: 2.5rem;
		background-color: $color5;
		padding-right: 0.5rem;
		border-radius: 1rem 0 0 1rem;
		font-weight: bold;
	}
	.events {
		position: relative;
	}
	.start {
		padding: 1rem;
		height: 10rem;
		border-radius: 1rem 1rem 0 0;
	}
	.end {
		padding: 1rem;
		height: 10rem;
		border-radius: 0 0 1rem 1rem;
	}
</style>
