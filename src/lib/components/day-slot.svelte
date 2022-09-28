<script lang="ts">
	import {
		events,
		idToI,
		MINUTES_HOUR,
		overDaySlotElement,
		selectedEvent,
		zoom,
		type IItinerary
	} from '$lib/store';
	import { element } from 'svelte/internal';
	import EventBlock from '$lib/components/event-block.svelte';

	export let itinerary: IItinerary;
	let slotElement: HTMLElement;

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
		if ($selectedEvent) {
			// og event card offset calc, mouse did not click at the center of the card
			const yCenterPercent =
				(($selectedEvent.pointerEvent.clientY - $selectedEvent.boundingRect.y) /
					$selectedEvent.boundingRect.height) *
				100;
			const offsetY = (yCenterPercent / 100) * MINUTES_HOUR;

			const box = slotElement.getBoundingClientRect();
			const start = itinerary.startTime + e.clientY - box.y - offsetY;
			const end = start + MINUTES_HOUR;

			$events[$idToI[$selectedEvent.eventId]].plan = {
				startTime: start,
				endTime: end
			};
			itinerary.eventIds = [...itinerary.eventIds, $selectedEvent.eventId];
		}
	};
</script>

<section
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
	<div class="start" />
	<div class="events">
		{#each itinerary.eventIds as eventId}
			<EventBlock bind:event={$events[$idToI[eventId]]} dayStartTime={itinerary.startTime} />
		{/each}
	</div>
	<div class="end" />
</section>

<style>
	.container {
		margin: 5rem 0;
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
