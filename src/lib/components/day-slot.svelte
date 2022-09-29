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
		type IEventID
	} from '$lib/store';
	import EventBlock from '$lib/components/event-block.svelte';
	import { identity } from 'svelte/internal';
	import { sleep } from '$lib/util';
	import type { RouteResponse } from '$lib/api-types/routing';

	export let itinerary: IItinerary;
	let slotElement: HTMLElement;

	let travelTime: {
		startEventId: IEventID;
		endEventId: IEventID;
		duration: number;
	}[] = [];

	$: startTime = itinerary.startTime;
	$: endTime = itinerary.endTime;

	$: numberOfHours = (endTime - startTime) / MINUTES_HOUR + 1;
	$: offsetHours = startTime / MINUTES_HOUR;
	$: height = (endTime - startTime) * $zoom;

	const onPointerOver = (e: PointerEvent) => {
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
			const offsetY = (yCenterPercent / 100) * MINUTES_HOUR;

			const box = slotElement.getBoundingClientRect();
			const start = itinerary.startTime + e.clientY - box.y - offsetY;
			const end = start + MINUTES_HOUR;

			$events[$eIdToI[$draggedEvent.eventId]].plan = {
				itineraryId: itinerary.id,
				startTime: start,
				endTime: end
			};
			if (!itinerary.eventIds.find((id) => id === $draggedEvent?.eventId)) {
				itinerary.eventIds.push($draggedEvent.eventId);
				itinerary = itinerary;
			}
		}
	};

	interface ISimpleEvent {
		start: number;
		end: number;
		eventId: IEventID;
		cords: { lat: number; lon: number } | null;
	}

	const calcTravelTime = () => {
		const simpleEvents = itinerary.eventIds
			.reduce((locTiming, id) => {
				const event = $events[$eIdToI[id]];
				if (event.plan !== null) {
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

		const fetchData = async (events: ISimpleEvent[]) => {
			travelTime = [];
			
			for (let i = 0; i < events.length - 1; i++) {
				const eventA = events[i];
				const eventB = events[i + 1];

				if (eventA.cords !== null && eventB.cords !== null) {
					const res = await fetch(
						`https://routing.openstreetmap.de/routed-car/route/v1/driving/${eventA.cords.lon},${eventA.cords.lat};${eventB.cords.lon},${eventB.cords.lat}`
					);
					const json = (await res.json()) as RouteResponse;
					travelTime.push({
						startEventId: eventA.eventId,
						endEventId: eventB.eventId,
						duration: json.routes[0].duration
					});
					travelTime = travelTime;
				}

				await sleep(1000);
			}
		};

		fetchData(simpleEvents);
	};

	$: console.log(travelTime);
</script>

<section>
	<button on:click={calcTravelTime}>show travel time</button>
	<div class="start" />
	<div
		class="container"
		style={`height: ${height}px`}
		on:pointerenter={onPointerOver}
		on:pointerleave={onPointerLeave}
		on:pointerup={onPointerUp}
		bind:this={slotElement}
	>
		<div class="markers">
			{#each Array(numberOfHours) as _, count}
				<p style={`transform: translateY(${count * MINUTES_HOUR * $zoom}px)`}>
					{offsetHours + count}:00
				</p>
			{/each}
		</div>
		<div class="events">
			{#each itinerary.eventIds as eventId}
				<EventBlock bind:event={$events[$eIdToI[eventId]]} dayStartTime={itinerary.startTime} />
			{/each}
		</div>
	</div>
	<div class="end" />
</section>

<style>
	section {
		margin: 5rem 0;
	}
	.container {
		display: block;
		background-image: linear-gradient(0deg, #222 50%, #333 50%);
		background-size: 1px 120px;
		max-width: 30rem;
	}
	.markers {
		position: relative;
	}
	.markers > p {
		height: 2rem;
		position: absolute;
		top: -1rem;
		left: 0;
		margin: 0;
		color: white;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 1rem;
		background-color: #111;
		width: 5rem;
	}
	.events {
		position: relative;
	}
</style>
