<script lang="ts">
	import { events, eIdToI, draggedEvent, type IEvent, type IEventID } from '$lib/store';
	import EventCardInner from '$lib/components/event-card-inner.svelte';

	export let eventId: IEventID;

	$: dragging = $draggedEvent?.eventId === eventId;
</script>

<div class:dragging>
	<EventCardInner bind:event={$events[$eIdToI[eventId]]} />
</div>

<style>
	div {
		width: 10rem;
	}
	.dragging {
		opacity: 0.2;
	}
</style>
