<script>
	import DaySlot from '$lib/components/day-slot.svelte';
	import { events, expandedEvent, eIdToI, itineraries, draggedEvent } from '$lib/store';
	import EventTray from '$lib/components/event-tray.svelte';
	import Ghost from '$lib/components/ghost.svelte';
	import ExpandedEvent from '$lib/components/expanded-event.svelte';
</script>

<main>
	<div class="slots">
		{#each $itineraries as itinerary}
			<DaySlot bind:itinerary />
		{/each}
	</div>

	<EventTray />

	<Ghost />

	{#if $expandedEvent}
		<ExpandedEvent bind:event={$events[$eIdToI[$expandedEvent]]} />
	{/if}

	<div class="debug">
		<button on:click={() => localStorage.clear()}>clear all</button>
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
		button {
			color: black;
		}
	}
	.sun {
		position: fixed;
		right: 0;
		top: 0;
		max-width: 500px;
		max-height: 500px;
		height: 60vw;
		width: 60vw;
		transform: translate(50%, -50%);
		border-radius: 50%;
		background-color: $color5_l7;
		z-index: -10;
		box-shadow: inset 0 0 200px $color5;
		&::after {
			content: '';
			pointer-events: none;
			position: absolute;
			inset: 10%;
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
			background-image: radial-gradient(rgba($color5, 0.2) 10%, rgba($color4, 0) 70%);
			z-index: -1;
		}
	}
	.slots {
		display: grid;
		grid-auto-flow: column;
		width: fit-content;
		overflow-x: scroll;
	}
</style>
