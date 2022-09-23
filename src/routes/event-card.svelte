<script lang="ts">
	import type { IEvent } from '$lib/util/store';

	export let event: IEvent;
</script>

<article>
	<input type="text" bind:value={event.name} size="1" />
</article>

<style>
	article {
		background-color: #222;
		padding: 0.5rem;
    width: 10rem;
	}
	input {
		border: none;
		background-color: #333;
		padding: 0.25rem 0.5rem;
    color: white;
    width: 100%;
	}
</style>
