<script>
	import DaySlot from './day-slot.svelte';
	import { daysStore } from '$lib/util/store';
	import EventTray from './event-tray.svelte';
</script>

<main>
	{#each $daysStore as dayData}
		<DaySlot bind:dayData />
	{/each}

	<EventTray />
</main>

<style>
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
