<script lang="ts">
	import { MINUTES_HOUR, zoom, type IDaySlotData } from '$lib/util/store';
	import EventBlock from './event-block.svelte';

	export let dayData: IDaySlotData;

	$: startTime = dayData.startTime;
	$: endTime = dayData.endTime;

	$: numberOfHours = (endTime - startTime) / MINUTES_HOUR + 1;
	$: offsetHours = startTime / MINUTES_HOUR;
	$: height = (endTime - startTime) * $zoom;

	const onPointerOver = (e: PointerEvent) => {
		console.log(e.clientX);
	}
</script>

<section class="container" style={`height: ${height}px`} on:pointerover={onPointerOver}>
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
			<EventBlock bind:eventBlock />
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
</style>
