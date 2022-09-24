<script lang="ts">
	import type { IEvent } from '$lib/util/store';

	export let event: IEvent;

	let pointerDown = false;
	let offsetX = 0;
	let offsetY = 0;
	let pointerX = 0;
	let pointerY = 0;
	let width = 0;
	let height = 0;

	const onPointerDown = (e: PointerEvent) => {
		const box = (e.target as Element)?.getBoundingClientRect();
		console.log(e.clientX);

		const cX = box.x + box.width / 2;
		const cY = box.y + box.height / 2;

		offsetX = cX - e.clientX;
		offsetY = cY - e.clientY;

		pointerX = e.clientX;
		pointerY = e.clientY;

		pointerDown = true;
		width = box.width;
		height = box.height;
	};
	const onPointerUp = () => {
		pointerDown = false;
	};
	const onPointerMove = (e: PointerEvent) => {
		pointerX = e.clientX;
		pointerY = e.clientY;
	};

	$: ghostX = pointerX + offsetX - width / 2;
	$: ghostY = pointerY + offsetY - height / 2;
</script>

<svelte:window on:pointerup={onPointerUp} on:pointermove={onPointerMove} />

<article on:pointerdown={onPointerDown} class:dragging={pointerDown}>
	<input type="text" bind:value={event.name} size="1" />
</article>

{#if pointerDown}
	<div
		class="ghost"
		style={`transform: translate(${ghostX}px, ${ghostY}px); width: ${width}px ;height: ${height}px;`}
	>
		<div class="ghost-body">
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
		touch-action: 'none';
	}
	article.dragging {
		opacity: 0;
		touch-action: 'none';
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
		touch-action: 'none';
	}
	.ghost-body {
		width: 100%;
		height: 100%;
		animation-name: ghost-in;
		animation-duration: 0.2s;
		animation-fill-mode: forwards;
	}
	@keyframes ghost-in {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(1.1);
		}
	}
</style>
