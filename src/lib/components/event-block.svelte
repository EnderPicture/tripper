<script lang="ts">
	import { EventBlockType, expandedEvent, type IEvent } from '$lib/store';
	import { end_hydrating } from 'svelte/internal';
	import EventDragHandle, { DragMode } from './event-drag-handle.svelte';

	export let event: IEvent;
	export let dayStartTime: number | null = null;
	export let type: EventBlockType;

	let pointerIn = false;

	$: startTime = event?.plan?.startTime ?? 0;
	$: endTime = event?.plan?.endTime ?? 0;

	$: start = startTime - (dayStartTime ?? 0);
	$: height = endTime - startTime;

	const onClick = () => {
		$expandedEvent = event.id;
	};

	const onPointerLeave = (e: PointerEvent) => {
		if (e.pointerType !== 'touch') {
			pointerIn = false;
		}
	};
</script>

<svelte:window on:pointerdown={() => (pointerIn = false)} />

{#if event}
	{#if type === EventBlockType.mid}
		<article
			class="abs"
			style={`transform: translateY(${start}px); height: ${height}px`}
			on:pointerenter={() => (pointerIn = true)}
			on:pointerleave={onPointerLeave}
		>
			<div class="inner">
				<div class="duration-display" style={`height: ${height}px`} />
				<p>{event.location?.name}</p>
				<div class="spacer" />
				<button on:click={onClick}>expand</button>
			</div>
			{#if event.plan}
				<EventDragHandle bind:value={event.plan} mode={DragMode.WholeEvent} {pointerIn} />
				<EventDragHandle bind:value={event.plan} mode={DragMode.EndTime} {pointerIn} />
			{/if}
		</article>
	{:else if type === EventBlockType.start}
		<article class="start">
			<div class="inner">
				<div class="duration-display" />
				<p>{event.location?.name}</p>
				<div class="spacer" />
				<button on:click={onClick}>expand</button>
			</div>
		</article>
	{:else if type === EventBlockType.end}
		<article class="end">
			<div class="inner">
				<div class="duration-display" />
				<p>{event.location?.name}</p>
				<div class="spacer" />
				<button on:click={onClick}>expand</button>
			</div>
		</article>
	{/if}
{/if}

<style lang="scss">
	.abs {
		position: absolute;
		top: 0;
		left: 0;
	}
	article {
		width: 100%;
		padding: 0 1rem;
		min-height: 2rem;
	}
	p {
		margin: 0;
		font-weight: 900;
		font-size: 1.1rem;
	}
	.inner {
		height: 100%;
		padding: 0 1rem;
		background-color: rgba($color2_d3, 0.5);
		border-radius: 0.5rem;
		overflow: hidden;
		display: flex;
		align-items: center;
		position: relative;
	}
	.duration-display {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: $color2_d3;
		z-index: -1;
	}
	.spacer {
		flex: 1;
	}
	.start {
		bottom: 0;
		left: 0;
	}
	.end {
		top: 0;
		left: 0;
	}
	button {
		border: none;
		background-color: $color2_d1;
		padding: 0.5rem 1rem;
	}
</style>
