<script lang="ts">
	import {
		MINUTES_HOUR,
		overDaySlotElement,
		selectedEvent,
		zoom,
		type IDaySlotData
	} from '$lib/util/store';
	import { element } from 'svelte/internal';
	import EventBlock from './event-block.svelte';

	export let dayData: IDaySlotData;
	let slotElement: HTMLElement;

	$: startTime = dayData.startTime;
	$: endTime = dayData.endTime;

	$: numberOfHours = (endTime - startTime) / MINUTES_HOUR + 1;
	$: offsetHours = startTime / MINUTES_HOUR;
	$: height = (endTime - startTime) * $zoom;

	const onPointerOver = (e: PointerEvent) => {
		$overDaySlotElement = {
			slotData: dayData,
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
			const start = dayData.startTime + e.clientY - box.y - offsetY;
			const end = start + MINUTES_HOUR;

			dayData.events = [
				...dayData.events,
				{ event: $selectedEvent.event, startTime: start, endTime: end }
			];
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
		{#each dayData.events as eventBlock}
			<EventBlock bind:eventBlock dayStartTime={dayData.startTime} />
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
