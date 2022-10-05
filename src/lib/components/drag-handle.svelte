<script lang="ts" context="module">
	export enum DragMode {
		WholeEvent,
		EndTime
	}
</script>

<script lang="ts">
	import type { IPlan } from '$lib/store';

	export let value: IPlan;
	export let mode: DragMode;

	let pointerDown = false;
	let pointerY = 0;
	let oldStart = 0;
	let oldEnd = 0;

	const onPointerDown = (e: PointerEvent) => {
		pointerDown = true;
		pointerY = e.clientY;
		oldStart = value.startTime;
		oldEnd = value.endTime;
	};
	const onPointerMove = (e: PointerEvent) => {
		if (pointerDown) {
			value.endTime = oldEnd + e.clientY - pointerY;

			if (mode === DragMode.WholeEvent) {
				value.startTime = oldStart + e.clientY - pointerY;
			}

			value.endTime = value.endTime > value.startTime ? value.endTime : value.startTime;
		}
	};
	const onPointerUp = (e: PointerEvent) => {
		pointerDown = false;
	};
</script>

<svelte:window
	on:pointerup|preventDefault={onPointerUp}
	on:pointermove|preventDefault={onPointerMove}
/>

<div
	class="handle"
	class:whole={mode === DragMode.WholeEvent}
	class:end={mode === DragMode.EndTime}
	on:pointerdown|preventDefault={onPointerDown}
>
	<div />
	<div />
	<div />
</div>

<style lang="scss">
	.handle {
		touch-action: none;
		background-color: darken($color2, 20);
		height: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		> div {
			height: 2px;
			width: 60%;
			background-color: darken($color2, 30);
		}
	}
	.whole {
		position: absolute;
		top: 0;
		left: 50%;
		width: 60%;
		transform: translate(-50%, -100%);
		border-radius: 0.5rem 0.5rem 0 0;
	}
	.end {
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 30%;
		transform: translate(-50%, 100%);
		border-radius:  0 0 0.5rem 0.5rem;
	}
</style>
