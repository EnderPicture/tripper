<script lang="ts">
	import { expandedEvent, type IEvent } from '$lib/store';
	import { end_hydrating } from 'svelte/internal';

	export let event: IEvent;
	export let dayStartTime: number;

	$: startTime = event?.plan?.startTime ?? 0;
	$: endTime = event?.plan?.endTime ?? 0;

	$: start = startTime - dayStartTime;
	$: height = endTime - startTime;

	const onClick = () => {
		$expandedEvent = event.id;
	};
</script>

{#if event}
	<article style={`transform: translateY(${start}px); height: ${height}px`}>
		<div class="inner">
			<p>{event.name}</p>
			<p>{event.location?.name}</p>
			<!-- <button on:click={onClick}>expand</button> -->
		</div>
	</article>
{/if}

<style lang="scss">
	article {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}
	p {
		margin: 0;
	}
	.inner {
		height: 100%;
		padding: 1rem;
		background-color: $color1;
	}
</style>
