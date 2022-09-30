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
			<div class="drag-tag" on:pointerdown|preventDefault={onPointerDown}>
				<div />
				<div />
				<div />
			</div>
			<input type="text" bind:value={event.name} size="1" />
			<button on:click={onExpand}>expand</button>
		</div>
	</article>
{/if}

<style lang="scss">
	article {
		width: 100%;
		height: 100%;
		padding-top: var(--tag-height);
		--tag-height: 2rem;
	}
	.inner {
		background-color: lighten($color2, 10);
		padding: 0.5rem;
		padding-top: 1rem;
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: .5rem;
		border-bottom: $color3 5px solid;
		box-shadow: 0 0 20px #0001;
	}
	input {
		border: none;
		background-color: #333;
		padding: 0.25rem 0.5rem;
		color: white;
		width: 100%;
	}
	.drag-tag {
		width: 3rem;
		border-radius: .5rem;
		height: var(--tag-height);
		background-color: lighten($color3, 10);
		touch-action: none;
		position: absolute;
		bottom: 100%;
		left: 0;
		display: grid;
		grid-template-rows: repeat(3, 1fr);
		padding: 0.25rem;
		gap: 0.25rem;
		transform: translate(-5px, 10px) rotate(-10deg);
		> div {
			border-radius: .5rem;
			background-color: darken($color3, 10);
		}
	}
</style>
