<script>
	import DaySlot from './day-slot.svelte';
	import { events, expandedEvent, idToI, itineraries, selectedEvent } from '$lib/store';
	import EventTray from './event-tray.svelte';
	import Ghost from './ghost.svelte';
	import ExpandedEvent from './expanded-event.svelte';
</script>

<main>
	{#each $itineraries as itinerary}
		<DaySlot bind:itinerary />
	{/each}

	<EventTray />

	<Ghost />

	{#if $expandedEvent}
		<ExpandedEvent bind:event={$events[$idToI[$expandedEvent]]} />
	{/if}

	<div class="debug">
		{$selectedEvent}
	</div>
</main>

<style>
	.debug {
		position: fixed;
		top: 0;
		left: 0;
		color: white;
	}
	:global(body) {
		margin: 0;
		background-color: #000;
	}
	:global(*) {
		box-sizing: border-box;
	}
	main {
		padding-bottom: 15rem;
	}
</style>
