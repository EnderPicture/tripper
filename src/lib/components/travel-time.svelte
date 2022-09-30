<script lang="ts">
	import type { IItinerary, ITravelTime } from '$lib/store';
	import { getCenter } from '$lib/util';
	import TravelTimeBlock from './travel-time-block.svelte';

	export let travelTimes: ITravelTime[];
	export let itinerary: IItinerary;
</script>

<div class="travel">
	{#each travelTimes as travelTime}
		<TravelTimeBlock {travelTime} {itinerary} />
	{/each}
</div>

<style>
	.travel {
		position: relative;
	}
</style>
