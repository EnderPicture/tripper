<script lang="ts">
	import EventCard from '$lib/components/event-card.svelte';
	import { events, Rating } from '$lib/store';
	import { uuid } from '$lib/util';
	import { flip } from 'svelte/animate';
	import RimLight from './rim-light.svelte';

	const onAdd = () => {
		events.update((events) => {
			events.unshift({
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
	<RimLight />
	<div class="scroll">
		<div class="scroll-con">
			<button class="add" on:click={onAdd}>+</button>
			{#each $events as event (event.id)}
				<div class="card" animate:flip={{ duration: 500 }}>
					<EventCard bind:eventId={event.id} />
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.event-tray {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: 50rem;

		height: 18rem;
		background-color: $color1_d7;

		border-radius: 1rem 1rem 0 0;
		box-shadow: 0 0 20px #0002;
		z-index: 10;
	}
	.scroll {
		height: 100%;
		overflow-x: scroll;
	}
	.scroll-con {
		width: fit-content;
		height: 100%;
		display: grid;
		grid-auto-flow: column;
		align-items: center;
		padding: 1rem;
		gap: 1rem;
		overflow: hidden;
		transform: translate3d(0,0,0);
	}
	.add {
		border: none;
		border-radius: 0.5rem;
		font-size: 5rem;
		color: $color1;
		background-color: $color1_d5;
		height: 5rem;
		width: 5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.card {
		height: 100%;
	}
</style>
