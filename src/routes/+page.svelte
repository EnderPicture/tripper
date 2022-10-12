<script>
	import DaySlot from '$lib/components/day-slot.svelte';
	import { events, expandedEvent, eIdToI, itineraries, draggedEvent } from '$lib/store';
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
		<ExpandedEvent bind:event={$events[$eIdToI[$expandedEvent]]} />
	{/if}

	<div class="debug">
		{$draggedEvent}
	</div>
	<div class="sun" />
</main>

<style lang="scss">
	main {
		display: flex;
		justify-content: center;
	}
	.debug {
		position: fixed;
		top: 0;
		left: 0;
		color: white;
	}
	main {
		padding-bottom: 15rem;
	}
	.sun {
		position: fixed;
		right: 0;
		top: 0;
		height: 800px;
		width: 800px;
		transform: translate(50%, -50%);
		border-radius: 50%;
		background-color: $color5_l7;
		z-index: -1;
		box-shadow: inset 0 0 200px $color5;
		&::after {
			content: '';
			pointer-events: none;
			position: absolute;
			inset: 100px;
			border-radius: 50%;
			background-color: $color5_l8;
			z-index: 1;
		}
		&::before {
			content: '';
			pointer-events: none;
			position: absolute;
			inset: -50%;
			border-radius: 50%;
			background-image: radial-gradient(rgba($color5, .2) 10%, rgba($color4, 0) 70%);
			z-index: -1;
		}
	}
</style>
