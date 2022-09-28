<script lang="ts">
	import { events, type IEventID } from '$lib/store';
	import { end_hydrating } from 'svelte/internal';

	export let eventId: IEventID;
	export let dayStartTime: number;

	$: event = $events.find((e) => e.id === eventId);

	$: startTime = event?.plan?.startTime ?? 0;
	$: endTime = event?.plan?.endTime ?? 0;

	$: start = startTime - dayStartTime;
	$: height = endTime - startTime;
</script>

{#if event}
	<article style={`transform: translateY(${start}px); height: ${height}px`}>
		<p>this is a thing</p>
		<input bind:value={event.name} />
		<p>
			{event.name}
		</p>
	</article>
{/if}

<style>
	article {
		position: absolute;
		top: 0;
		left: 0;
		background-color: red;
		width: 100%;
	}
</style>
