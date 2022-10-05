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
		type ITravelTime,
		EventBlockType
	} from '$lib/store';
	import EventBlock from '$lib/components/event-block.svelte';
	import { identity } from 'svelte/internal';
	import { sleep } from '$lib/util';
	import type { RouteResponse } from '$lib/api-types/routing';
	import TravelTime from './travel-time.svelte';
	import DragHandle from './drag-handle.svelte';
	import { fly } from 'svelte/transition';

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

	$: exactHourOffset = -(startTime % MINUTES_HOUR) * $zoom;
	$: backgroundOffset = -(startTime % (MINUTES_HOUR * 2)) * $zoom;

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
					startTime: itinerary.startTime,
					endTime: itinerary.startTime
				};

				itinerary.startEvent = $draggedEvent.eventId;
			} else if (onTopOf === OnTopOfType.end) {
				$events[$eIdToI[$draggedEvent.eventId]].plan = {
					itineraryId: itinerary.id,
					startTime: itinerary.endTime,
					endTime: itinerary.endTime
				};

				itinerary.endEvent = $draggedEvent.eventId;
			}
		}
	};

	const deleteIfExists = (idToBeDeleted: IEventID) => {
		let indexInList = itinerary.eventIds.findIndex((id) => id === idToBeDeleted);
		if (indexInList >= 0) {
			itinerary.eventIds.splice(indexInList, 1);
			itinerary = itinerary;
		} else if (itinerary.startEvent === idToBeDeleted) {
			itinerary.startEvent = null;
			// TODO: also remove ref itinerary id from the event as well
		} else if (itinerary.endEvent === idToBeDeleted) {
			itinerary.endEvent = null;
			// TODO: also remove ref itinerary id from the event as well
		}
	};

	const calcTravelTime = () => {
		const allEventIds = [...itinerary.eventIds];

		if (itinerary.startEvent) allEventIds.push(itinerary.startEvent);
		if (itinerary.endEvent) allEventIds.push(itinerary.endEvent);

		const simpleEvents = allEventIds
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

	const calcMarkerValue = (count: number) => {
		return Math.floor(offsetHours) + count;
	};
	const isMarkerWituinRange = (count: number) => {
		const hourInMinutes = calcMarkerValue(count) * MINUTES_HOUR;
		return itinerary.startTime < hourInMinutes && hourInMinutes < itinerary.endTime;
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
			<DragHandle bind:value={itinerary.startTime} reverse />
			<button on:click={calcTravelTime}>calculate travel time</button>
			<div class="spacer" />
			{#if itinerary.startEvent}
				<EventBlock
					bind:event={$events[$eIdToI[itinerary.startEvent]]}
					type={EventBlockType.start}
				/>
			{/if}
		</div>
		<div
			class="container"
			style={`height: ${height}px; background-position: 0 ${backgroundOffset}px`}
			on:pointerenter={(e) => onPointerOver(e, OnTopOfType.mid)}
			on:pointerleave={onPointerLeave}
			on:pointerup={onPointerUp}
			bind:this={slotElement}
		>
			<div class="events">
				{#each itinerary.eventIds as eventId}
					<EventBlock
						bind:event={$events[$eIdToI[eventId]]}
						dayStartTime={itinerary.startTime}
						type={EventBlockType.mid}
					/>
				{/each}
			</div>
			<TravelTime {itinerary} />
			<div class="markers">
				{#each Array(Math.ceil(numberOfHours)) as _, count (calcMarkerValue(count))}
					{#if isMarkerWituinRange(count)}
						<p style={`transform: translateY(${count * MINUTES_HOUR * $zoom + exactHourOffset}px)`}>
							<span transition:fly={{ duration: 200, x: 10 }}>
								{calcMarkerValue(count)}
							</span>
						</p>
					{/if}
				{/each}
			</div>
		</div>
		<div
			class="end"
			on:pointerenter={(e) => onPointerOver(e, OnTopOfType.end)}
			on:pointerleave={onPointerLeave}
			on:pointerup={onPointerUp}
		>
			{#if itinerary.endEvent}
				<EventBlock bind:event={$events[$eIdToI[itinerary.endEvent]]} type={EventBlockType.end} />
			{/if}
			<div class="spacer" />
			<DragHandle bind:value={itinerary.endTime} />
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
		p {
			position: absolute;
			top: -1rem;
			right: 100%;
			z-index: -1;
			margin: 0;
		}
		span {
			height: 2rem;
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
	}
	.events {
		position: relative;
	}
	.start {
		padding-top: 1rem;
		height: 10rem;
		border-radius: 1rem 1rem 0 0;
		position: relative;
		display: flex;
		flex-direction: column;
		z-index: 0;
	}
	.end {
		padding-bottom: 1rem;
		height: 10rem;
		border-radius: 0 0 1rem 1rem;
		position: relative;
		display: flex;
		flex-direction: column;
		z-index: 0;
	}
	.spacer {
		flex: 1;
	}
</style>
