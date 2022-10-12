<script lang="ts">
	import { events, eIdToI, draggedEvent, type IEvent, type IEventID } from '$lib/store';
	import EventCardInner from '$lib/components/event-card-inner.svelte';
	import { fly } from 'svelte/transition';

	export let eventId: IEventID;

	$: dragging = $draggedEvent?.eventId === eventId;
</script>

<div class:dragging transition:fly={{ y: 20, duration: 500 }}>
	<EventCardInner bind:event={$events[$eIdToI[eventId]]} />
</div>

<style>
	div {
		width: 15rem;
		height: 100%;
	}
	.dragging {
		opacity: 0.2;
	}
</style>
