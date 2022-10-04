<script lang="ts">
	import { EventBlockType, expandedEvent, type IEvent } from '$lib/store';
	import { end_hydrating } from 'svelte/internal';

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
				<p>{event.location?.name}</p>
				<div class="spacer" />
				<button on:click={onClick}>expand</button>
			</div>
		</article>
	{:else if type === EventBlockType.start}
		<article class="start">
			<div class="inner">
				<p>{event.location?.name}</p>
				<div class="spacer" />
				<button on:click={onClick}>expand</button>
			</div>
		</article>
	{:else if type === EventBlockType.end}
		<article class="end">
			<div class="inner">
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
	}
	p {
		margin: 0;
	}
	.inner {
		height: 100%;
		padding: 1rem;
		background-color: $color1;
		border-radius: 0.5rem;
		overflow: hidden;
		display: flex;
		align-items: center;
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
