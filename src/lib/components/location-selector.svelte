<script lang="ts">
	import type { NominatimResponse } from '$lib/api-types/nominatim';
	import type { PhotonGeocodingResponse } from '$lib/api-types/photon';
	import type { IEvent } from '$lib/store';

	export let location: IEvent['location'];

	let input = location?.name ?? '';
	let jsonLocationList: NominatimResponse | null = null;

	$: if (input !== '') {
		location = {
			name: input.trim(),
			cords: location?.cords ?? null
		};
	} else {
		location = null;
	}

	// $: console.log(location);

	const onSearch = () => {
		fetch(`https://nominatim.openstreetmap.org/search?q=${location?.name}&format=json`)
			.then((res) => res.json())
			.then((json) => (jsonLocationList = json));
	};

	const onSelectedLocation = (index: number) => {
		if (jsonLocationList && jsonLocationList[index]) {
			const selected = jsonLocationList[index];
			location = {
				name: selected.display_name.split(',')[0],
				cords: {
					lat: +selected.lat,
					lon: +selected.lon
				}
			};
			input = location.name;
			jsonLocationList = null;
		}
	};
</script>

<div class="location-input">
	<form on:submit|preventDefault={onSearch}>
		<input type="text" bind:value={input} placeholder="location" size="1" />
		<button>search</button>
	</form>
	{location?.cords?.lat ?? ''}
	{location?.cords?.lon ?? ''}
	{#if jsonLocationList}
		<div class="location-list">
			{#each jsonLocationList as feature, index}
				<button on:click={() => onSelectedLocation(index)}>
					{feature.type ?? ''}
					{feature.display_name ?? ''}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.location-input {
		position: relative;
	}
	form {
		display: flex;
	}
	input {
		flex: 1;
	}
	.location-list {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
	}
</style>
