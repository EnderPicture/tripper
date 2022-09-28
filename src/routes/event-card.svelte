<script lang="ts">
	import { events, selectedEvent, type IEvent, type IEventID } from '$lib/store';
	import EventCardInner from './event-card-inner.svelte';

	export let eventId: IEventID;

	$: dragging = $selectedEvent?.eventId === eventId;

	$: eventIndex = $events.findIndex((e) => e.id === eventId);
</script>

{#if eventIndex >= 0}
	<div class:dragging>
		<EventCardInner bind:event={$events[eventIndex]} />
	</div>
{/if}

<style>
	div {
		width: 10rem;
	}
	.dragging {
		opacity: 0.2;
	}
</style>
