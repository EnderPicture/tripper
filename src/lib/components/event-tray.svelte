<script lang="ts">
	import EventCard from '$lib/components/event-card.svelte';
	import { events, Rating } from '$lib/store';
	import { uuid } from '$lib/util';

	const onAdd = () => {
		events.update((events) => {
			events.push({
				id: uuid(),
				name: '',
				rating: Rating.meh,
				location: null,
				plan: null
			});
			return events;
		});
	};
</script>

<section class="event-tray">
	<div class="scroll-con">
		{#each $events as event}
			<EventCard bind:eventId={event.id} />
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
