<script lang="ts">
	import type { PhotonGeocodingResponse } from '$lib/api-types/photon';
	import type { IEvent } from '$lib/store';

	export let location: IEvent['location'];

	let input = location?.name ?? '';
	let jsonLocationList: PhotonGeocodingResponse | null = null;

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
		fetch(`https://photon.komoot.io/api/?q=${location?.name}`)
			.then((res) => res.json())
			.then((json) => (jsonLocationList = json));
	};

	const onSelectedLocation = (index: number) => {
		const selected = jsonLocationList?.features[index];
		if (selected) {
			location = {
				name: selected.properties.name,
				cords: {
					lat: selected.geometry.coordinates[1],
					lon: selected.geometry.coordinates[0]
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
			{#each jsonLocationList.features as feature, index}
				<button on:click={() => onSelectedLocation(index)}>
					{feature.properties.name ?? ''}
					{feature.properties.city ?? ''}
					{feature.properties.state ?? ''}
					{feature.properties.country ?? ''}
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
