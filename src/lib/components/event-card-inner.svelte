<script lang="ts">
	import { events, expandedEvent, draggedEvent, type IEvent, type IEventID } from '$lib/store';

	export let event: IEvent;
	let thisComp: HTMLElement;


	const onPointerDown = (e: PointerEvent) => {
		$draggedEvent = {
			pointerEvent: e,
			eventId: event.id,
			boundingRect: thisComp.getBoundingClientRect()
		};
	};
	const onExpand = () => {
		$expandedEvent = event.id;
	};
</script>

{#if event}
	<article bind:this={thisComp}>
		<div class="inner">
			<div class="drag-tag" on:pointerdown|preventDefault={onPointerDown} />
			<input type="text" bind:value={event.name} size="1" />
			<button on:click={onExpand}>expand</button>
		</div>
	</article>
{/if}

<style>
	article {
		width: 100%;
		height: 100%;
		padding-top: 2rem;
	}
	.inner {
		background-color: #222;
		padding: 0.5rem;
		width: 100%;
		height: 100%;
		position: relative;
	}
	input {
		border: none;
		background-color: #333;
		padding: 0.25rem 0.5rem;
		color: white;
		width: 100%;
	}
	.drag-tag {
		width: 2rem;
		height: 2rem;
		background-color: #444;
		touch-action: none;
		position: absolute;
		bottom: 100%;
		left: 0;
	}
</style>
