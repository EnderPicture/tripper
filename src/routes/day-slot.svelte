<script lang="ts">
	import { zoom, type IDaySlotData } from '$lib/util/store';
	import EventBlock from './event-block.svelte';

	export let dayData: IDaySlotData;

	$: startTime = dayData.startTime;
	$: endTime = dayData.endTime;
</script>

<section class="container" style={`height: ${(endTime - startTime) * $zoom}px`}>
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
</style>
