<script lang="ts">
	import { selectedEvent, type IEvent } from '$lib/util/store';
	import EventCardInner from './event-card-inner.svelte';

	export let event: IEvent;
	$: dragging = $selectedEvent?.event === event;
</script>

<div class:dragging>
	<EventCardInner bind:event />
</div>

<style>
	div {
		width: 10rem;
	}
	.dragging {
		opacity: 0.2;
	}
</style>
