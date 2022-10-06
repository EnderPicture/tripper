<script lang="ts">
	import { events, expandedEvent, draggedEvent, type IEvent, type IEventID } from '$lib/store';
	import LocationSelector from './location-selector.svelte';

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
			<div class="drag-tag" on:pointerdown|preventDefault={onPointerDown}>
				<div />
				<div />
				<div />
			</div>
			<div class="content">
				<!-- <input type="text" bind:value={event.name} size="1" /> -->
				<LocationSelector bind:location={event.location} />
				<button on:click={onExpand}>expand</button>
			</div>
		</div>
	</article>
{/if}

<style lang="scss">
	article {
		width: 100%;
		height: 100%;
	}
	.inner {
		background-color: lighten($color2, 10);
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: 0.5rem;
		box-shadow: 0 0 20px #0002;
		overflow: hidden;
	}
	.content {
		padding: 0.5rem;
	}
	// input {
	// 	border: none;
	// 	background-color: $color2;
	// 	padding: 0.25rem 0.5rem;
	// 	width: 100%;
	// }
	.drag-tag {
		touch-action: none;
		background-color: darken($color2, 20);
		width: 100%;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2px;
		flex-direction: column;
		> div {
			height: 2px;
			width: 50%;
			background-color: darken($color2, 30);
		}
	}
</style>
