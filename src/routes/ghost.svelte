<script lang="ts">
	import {
		MINUTES_HOUR,
		zoom,
		overDaySlotElement,
		selectedEvent,
		type IEvent
	} from '$lib/util/store';
	import EventCardInner from './event-card-inner.svelte';

	let overDaySlot = false;

	let offsetX = 0;
	let offsetY = 0;
	let pointerX = 0;
	let pointerY = 0;
	let width = 0;
	let height = 0;

	$: $selectedEvent ? onPointerDown($selectedEvent.pointerEvent) : null;
	const onPointerDown = (e: PointerEvent) => {
		console.log('hi');
		const box = (e.target as Element)?.getBoundingClientRect();

		const cX = box.x + box.width / 2;
		const cY = box.y + box.height / 2;

		offsetX = cX - e.clientX;
		offsetY = cY - e.clientY;

		pointerX = e.clientX;
		pointerY = e.clientY;

		width = box.width;
		height = box.height;

		(e.target as Element).releasePointerCapture(e.pointerId);
	};
	const onPointerUp = () => {
		$selectedEvent = null;
		overDaySlot = false;
	};
	const onPointerMove = (e: PointerEvent) => {
		if ($selectedEvent) {
			pointerX = e.clientX;
			pointerY = e.clientY;
			overDaySlot = $overDaySlotElement !== null;
		}
	};

	$: ghostX = pointerX + offsetX - width / 2;
	$: ghostY = pointerY + offsetY - height / 2;

	$: ghostWidth = $overDaySlotElement
		? $overDaySlotElement.element.getBoundingClientRect().width / 1.1
		: undefined;

	$: ghostHeight = $overDaySlotElement ? MINUTES_HOUR * $zoom : undefined;
</script>

<svelte:window
	on:pointerup|preventDefault={onPointerUp}
	on:pointermove|preventDefault={onPointerMove}
/>

{#if $selectedEvent}
	<div
		class="ghost"
		style={`transform: translate(${ghostX}px, ${ghostY}px); width: ${width}px ;height: ${height}px;`}
	>
		<div
			class="ghost-body"
			class:overSlot={overDaySlot}
			style={`width: ${ghostWidth}px; height: ${ghostHeight}px`}
		>
			<EventCardInner bind:event={$selectedEvent.event} />
		</div>
	</div>
{/if}

<style>
	.ghost {
		position: fixed;
		top: 0;
		left: 0;
		pointer-events: none;
		z-index: 100;
	}
	.ghost-body {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		animation-name: ghost-in;
		animation-duration: 0.2s;
		animation-fill-mode: forwards;
		transition: 0.2s ease;
	}
	.overSlot {
		/* background-color: red; */
	}
	@keyframes ghost-in {
		0% {
			transform: translate(-50%, -50%) scale(1);
		}
		100% {
			transform: translate(-50%, -50%) scale(1.1);
		}
	}
</style>
