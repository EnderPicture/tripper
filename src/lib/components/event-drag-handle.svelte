<script lang="ts" context="module">
	export enum DragMode {
		WholeEvent,
		EndTime
	}
</script>

<script lang="ts">
	import { UNIX_HOUR, zoom, type IPlan } from '$lib/store';

	export let value: IPlan;
	export let mode: DragMode;

	export let pointerIn: boolean;

	let pointerDown = false;
	let pointerY = 0;
	let oldStart = 0;
	let oldEnd = 0;

	$: console.log(oldStart);

	const onPointerDown = (e: PointerEvent) => {
		pointerDown = true;
		pointerY = e.clientY;
		oldStart = value.startTime;
		oldEnd = value.endTime;
	};
	const onPointerMove = (e: PointerEvent) => {
		if (pointerDown) {
			value.endTime = oldEnd + (e.clientY - pointerY) * UNIX_HOUR / $zoom;

			if (mode === DragMode.WholeEvent) {
				value.startTime = oldStart + (e.clientY - pointerY) * UNIX_HOUR / $zoom;
			}

			console.log(oldStart + e.clientY - pointerY)

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
	class:hover={pointerIn || pointerDown}
	on:pointerdown|preventDefault={onPointerDown}
>
	<div />
	<div />
	<div />
</div>

<style lang="scss">
	.handle {
		touch-action: none;
		background-color: $color1_d3;
		height: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		z-index: -2;
		transition: transform 0.2s ease;
		> div {
			height: 2px;
			width: 60%;
			background-color: $color1_d1;
		}
	}
	.whole {
		position: absolute;
		top: 0;
		left: 50%;
		width: 60%;
		transform: translate(-50%, -20%);
		border-radius: 0.5rem 0.5rem 0 0;
		&.hover {
			transform: translate(-50%, -100%);
		}
	}
	.end {
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 30%;
		transform: translate(-50%, 20%);
		border-radius: 0 0 0.5rem 0.5rem;
		&.hover {
			transform: translate(-50%, 100%);
		}
	}
</style>
