<script lang="ts">
	export let value: number;
	export let reverse: boolean = false;

	let pointerDown = false;
	let pointerY = 0;
	let oldValue = 0;

	const onPointerDown = (e: PointerEvent) => {
		pointerDown = true;
		pointerY = e.clientY;
		oldValue = value;
	};
	const onPointerMove = (e: PointerEvent) => {
		if (pointerDown) {
			if (reverse) {
				value = oldValue + pointerY - e.clientY;
			} else {
				value = oldValue + e.clientY - pointerY;
			}
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

<div class="handle" on:pointerdown|preventDefault={onPointerDown}>
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
</style>
