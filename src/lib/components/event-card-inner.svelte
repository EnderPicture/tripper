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
			<div class="drag-tag" class:placed={event.plan} on:pointerdown|preventDefault={onPointerDown}>
				<div />
				<div />
				<div />
			</div>
			<div class="content">
				<!-- <input type="text" bind:value={event.name} size="1" /> -->
				<LocationSelector bind:location={event.location} />
				<div class="spacer" />
				<button class="expand" on:click={onExpand}>expand</button>
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
		background-color: $color1_d5;
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.spacer {
		flex: 1;
	}
	.content {
		padding: 0.5rem;
		display: flex;
		flex: 1;
		flex-direction: column;
	}
	// input {
	// 	border: none;
	// 	background-color: $color2;
	// 	padding: 0.25rem 0.5rem;
	// 	width: 100%;
	// }
	.drag-tag {
		touch-action: none;
		background-color: $color2_d3;
		width: 100%;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2px;
		flex-direction: column;
		> div {
			height: 2px;
			border-radius: 100px;
			width: 50%;
			background-color: $color2_d1;
		}
		&.placed {
			background-color: $color1_d3;
			> div {
				background-color: $color1_d1;
			}
		}
	}
	.expand {
		border: none;
		padding: .5rem 1rem;
		background-color: $color1_d4;
	}
</style>
