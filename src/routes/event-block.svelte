<script lang="ts">
	import type { IEventBlock } from '$lib/util/store';

	export let eventBlock: IEventBlock;
  export let dayStartTime: number;

	$: start = eventBlock.startTime - dayStartTime;
	$: height = eventBlock.endTime - eventBlock.startTime;
</script>

<article style={`transform: translateY(${start}px); height: ${height}px`}>
	<p>this is a thing</p>
	<p>
		{eventBlock.event.name}
	</p>
</article>

<style>
	article {
		position: absolute;
		top: 0;
		left: 0;
		background-color: red;
	}
</style>
