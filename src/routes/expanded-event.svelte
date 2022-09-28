<script lang="ts">
	import { expandedEvent, type IEvent } from '$lib/store';

	export let event: IEvent;
</script>

<section />
<div class="event">
	<input type="text" bind:value={event.name} />
	<button on:click={() => ($expandedEvent = null)}>exit</button>
</div>

<style>
	section {
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
