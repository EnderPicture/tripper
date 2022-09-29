<script lang="ts">
	import { expandedEvent, type IEvent } from '$lib/store';
	import LocationSelector from './location-selector.svelte';

	export let event: IEvent;
	const onClose = () => {
		$expandedEvent = null;
	};
</script>

<div class="backdrop" on:click={onClose} />
<div class="event">
	<input type="text" bind:value={event.name} />
	<LocationSelector bind:location={event.location} />
	<button on:click={onClose}>exit</button>
</div>

<style>
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #000;
		opacity: 0.5;
	}
	.event {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		width: 17rem;
		height: 22rem;
		padding: 0.5rem;
		transform: translate(-50%, -50%);
		background-color: #333;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
