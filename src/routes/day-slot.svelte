<script lang="ts">
	import { zoom, type IDaySlotData } from '$lib/util/store';

	export let dayData: IDaySlotData;

	$: startTime = dayData.startTime;
	$: endTime = dayData.endTime;
</script>

<section class="container" style={`height: ${(endTime - startTime) * $zoom}px`}>hello</section>

<style>
	.container {
		display: block;
		background-color: red;
	}
</style>
