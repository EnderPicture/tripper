<script lang="ts">
	import { EventBlockType, expandedEvent, type IEvent } from '$lib/store';
	import { end_hydrating } from 'svelte/internal';
	import DragHandle, { DragMode } from './drag-handle.svelte';

	export let event: IEvent;
	export let dayStartTime: number | null = null;
	export let type: EventBlockType;

	$: startTime = event?.plan?.startTime ?? 0;
	$: endTime = event?.plan?.endTime ?? 0;

	$: start = startTime - (dayStartTime ?? 0);
	$: height = endTime - startTime;

	const onClick = () => {
		$expandedEvent = event.id;
	};
</script>

{#if event}
	{#if type === EventBlockType.mid}
		<article class="abs" style={`transform: translateY(${start}px); height: ${height}px`}>
			<div class="inner">
				<div class="duration-display" style={`height: ${height}px`} />
				<p>{event.location?.name}</p>
				<div class="spacer" />
				<button on:click={onClick}>expand</button>
			</div>
			{#if event.plan}
				<DragHandle bind:value={event.plan} mode={DragMode.WholeEvent} />
				<DragHandle bind:value={event.plan} mode={DragMode.EndTime} />
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
		padding: 0 10px;
		min-height: 2rem;
	}
	p {
		margin: 0;
	}
	.inner {
		height: 100%;
		padding: 0 1rem;
		background-color: rgba(lighten($color2, 20), 0.5);
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
		background-color: lighten($color2, 20);
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
</style>
