<script lang="ts">
	import {
		UNIX_HOUR,
		zoom,
		overDaySlotElement,
		draggedEvent,
		type IEvent,
		events,
		eIdToI
	} from '$lib/store';
	import EventCardInner from '$lib/components/event-card-inner.svelte';

	let overDaySlot = false;

	let offsetX = 0;
	let offsetY = 0;
	let pointerX = 0;
	let pointerY = 0;
	let width = 0;
	let height = 0;

	let xCenterPercent = 0;
	let yCenterPercent = 0;

	$: $draggedEvent
		? onPointerDown($draggedEvent.pointerEvent, $draggedEvent.boundingRect)
		: null;

	const onPointerDown = (e: PointerEvent, box: DOMRect) => {
		const cX = box.x + box.width / 2;
		const cY = box.y + box.height / 2;

		offsetX = cX - e.clientX;
		offsetY = cY - e.clientY;

		pointerX = e.clientX;
		pointerY = e.clientY;

		width = box.width;
		height = box.height;

		// whole point of this is so the ghost morphs around the pointer
		xCenterPercent = ((e.clientX - box.x) / box.width) * 100;
		yCenterPercent = ((e.clientY - box.y) / box.height) * 100;

		console.log({ xCenterPercent, yCenterPercent });

		(e.target as Element).releasePointerCapture(e.pointerId);
	};
	const onPointerUp = () => {
		$draggedEvent = null;
		overDaySlot = false;
	};
	const onPointerMove = (e: PointerEvent) => {
		if ($draggedEvent) {
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

	$: ghostHeight = $overDaySlotElement ? ($zoom / 1.1) : undefined;
</script>

<svelte:window
	on:pointerup|preventDefault={onPointerUp}
	on:pointermove|preventDefault={onPointerMove}
/>

{#if $draggedEvent}
	<div
		class="ghost"
		style={`transform: translate(${ghostX}px, ${ghostY}px); width: ${width}px ;height: ${height}px;`}
	>
		<div
			class="ghost-body"
			class:overSlot={overDaySlot}
			style={`width: ${ghostWidth}px; height: ${ghostHeight}px; --xCenter: ${xCenterPercent}%; --yCenter: ${yCenterPercent}%`}
		>
			<EventCardInner bind:event={$events[$eIdToI[$draggedEvent.eventId]]} />
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
		top: var(--yCenter);
		left: var(--xCenter);
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
			transform-origin: var(--xCenter) var(--yCenter);
			transform: translate(calc(-1 * var(--xCenter)), calc(-1 * var(--yCenter))) scale(1);
		}
		100% {
			transform-origin: var(--xCenter) var(--yCenter);
			transform: translate(calc(-1 * var(--xCenter)), calc(-1 * var(--yCenter))) scale(1.1);
		}
	}
</style>
