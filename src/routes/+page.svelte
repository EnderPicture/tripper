<script>
	import DaySlot from './day-slot.svelte';
	import { daysStore } from '$lib/util/store';
</script>

{#each $daysStore as dayData}
	<DaySlot {dayData} />
{/each}

<style>
	:global(body) {
		margin: 0;
		box-sizing: border-box;
	}
</style>
