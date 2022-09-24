<script lang="ts">
	import EventCard from './event-card.svelte';
	import { eventsStore, Rating } from '$lib/util/store';

	const onAdd = () => {
		eventsStore.update((events) => {
			events.push({
				name: '',
				rating: Rating.meh,
				location: null
			});
			return events;
		});
	};
</script>

<section class="event-tray">
	<div class="scroll-con">
		{#each $eventsStore as event}
			<EventCard bind:event />
		{/each}
		<button on:click={onAdd}>add new event</button>
	</div>
</section>

<style>
	.event-tray {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		overflow-x: auto;
		background-color: #111;
		height: 15rem;
	}
	.scroll-con {
		width: fit-content;
		height: 100%;
		padding: 0.5rem;
		display: grid;
		grid-auto-flow: column;
		gap: 0.5rem;
	}
</style>
