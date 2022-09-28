<script lang="ts">
	import { events, idToI, selectedEvent, type IEvent, type IEventID } from '$lib/store';
	import EventCardInner from './event-card-inner.svelte';

	export let eventId: IEventID;

	$: dragging = $selectedEvent?.eventId === eventId;
</script>

<div class:dragging>
	<EventCardInner bind:event={$events[$idToI[eventId]]} />
</div>

<style>
	div {
		width: 10rem;
	}
	.dragging {
		opacity: 0.2;
	}
</style>
