<script>
	import DaySlot from '$lib/components/day-slot.svelte';
	import { events, expandedEvent, idToI, itineraries, draggedEvent } from '$lib/store';
	import EventTray from '$lib/components/event-tray.svelte';
	import Ghost from '$lib/components/ghost.svelte';
	import ExpandedEvent from '$lib/components/expanded-event.svelte';
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
		{$draggedEvent}
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
