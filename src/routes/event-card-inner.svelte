<script lang="ts">
	import { selectedEvent, type IEvent } from '$lib/util/store';

	export let event: IEvent;

	const onPointerDown = (e: PointerEvent) => {
		console.log('tests');
		$selectedEvent = {
			pointerEvent: e,
			event
		};
	};

</script>

<article on:pointerdown|preventDefault={onPointerDown}>
	<input type="text" bind:value={event.name} size="1" />
</article>

<style>
	article {
		background-color: #222;
		padding: 0.5rem;
		touch-action: none;
		width: 100%;
		height: 100%;
	}
	input {
		border: none;
		background-color: #333;
		padding: 0.25rem 0.5rem;
		color: white;
		width: 100%;
	}
</style>
