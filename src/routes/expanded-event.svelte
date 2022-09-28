<script lang="ts">
	import type { IEvent } from '$lib/store';

	export let event: IEvent;
</script>

<section>
	<input type="text" bind:value={event.name} />
</section>
