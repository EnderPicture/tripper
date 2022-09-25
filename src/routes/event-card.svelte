<script lang="ts">
	import { overDaySlotElement, type IEvent } from '$lib/util/store';

	export let event: IEvent;

	let pointerDown = false;
	let overDaySlot = false;

	let offsetX = 0;
	let offsetY = 0;
	let pointerX = 0;
	let pointerY = 0;
	let width = 0;
	let height = 0;

	const onPointerDown = (e: PointerEvent) => {
		const box = (e.target as Element)?.getBoundingClientRect();

		const cX = box.x + box.width / 2;
		const cY = box.y + box.height / 2;

		offsetX = cX - e.clientX;
		offsetY = cY - e.clientY;

		pointerX = e.clientX;
		pointerY = e.clientY;

		pointerDown = true;
		width = box.width;
		height = box.height;

		(e.target as Element).releasePointerCapture(e.pointerId);
	};
	const onPointerUp = () => {
		pointerDown = false;
		overDaySlot = false;
	};
	const onPointerMove = (e: PointerEvent) => {
		if (pointerDown) {
			pointerX = e.clientX;
			pointerY = e.clientY;
			overDaySlot = $overDaySlotElement !== null;
		}
	};

	$: ghostX = pointerX + offsetX - width / 2;
	$: ghostY = pointerY + offsetY - height / 2;
</script>

<svelte:window
	on:pointerup|preventDefault={onPointerUp}
	on:pointermove|preventDefault={onPointerMove}
/>

<article on:pointerdown|preventDefault={onPointerDown} class:dragging={pointerDown}>
	<input type="text" bind:value={event.name} size="1" />
</article>

{#if pointerDown}
	<div
		class="ghost"
		style={`transform: translate(${ghostX}px, ${ghostY}px); width: ${width}px ;height: ${height}px;`}
	>
		<div
			class="ghost-body"
			class:overSlot={overDaySlot}
			style={`width: ${
				$overDaySlotElement
					? $overDaySlotElement.element.getBoundingClientRect().width / 1.1
					: undefined
			}px`}
		>
			<input type="text" bind:value={event.name} size="1" />
		</div>
	</div>
{/if}

<style>
	article,
	.ghost-body {
		background-color: #222;
		padding: 0.5rem;
		width: 10rem;
		touch-action: none;
	}
	article.dragging {
		opacity: 0.2;
	}
	input {
		border: none;
		background-color: #333;
		padding: 0.25rem 0.5rem;
		color: white;
		width: 100%;
	}
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
		background-color: red;
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
