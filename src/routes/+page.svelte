<script>
	import DaySlot from './day-slot.svelte';
	import { daysStore, overDaySlotElement } from '$lib/util/store';
	import EventTray from './event-tray.svelte';
</script>

<main>
	{#each $daysStore as dayData}
		<DaySlot bind:dayData />
	{/each}

	<EventTray />

	<!-- <div class="debug">
	</div> -->
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
