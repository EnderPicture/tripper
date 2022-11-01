<script lang="ts">
	import type { NominatimResponse } from '$lib/api-types/nominatim';
	import type { PhotonGeocodingResponse } from '$lib/api-types/photon';
	import type { IEvent } from '$lib/store';

	export let location: IEvent['location'];

	let input = location?.name ?? '';
	let jsonLocationList: NominatimResponse | null = null;

	$: if (input.trim() !== '') {
		location = {
			name: input.trim(),
			cords: location?.cords ?? null
		};
	} else {
		location = null;
	}

	$: console.log(jsonLocationList);

	const onSearch = () => {
		console.log(location);
		if (location) {
			if (location.name !== '') {
				fetch(`https://nominatim.openstreetmap.org/search?q=${location?.name}&format=json`)
					.then((res) => res.json())
					.then((json) => (jsonLocationList = json));
			}
		} else {
			jsonLocationList = null;
		}
	};

	const onSelectedLocation = (index: number) => {
		if (jsonLocationList && jsonLocationList[index]) {
			const selected = jsonLocationList[index];
			location = {
				name: selected.display_name,
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
		{#if jsonLocationList}
			<div class="location-list">
				{#each jsonLocationList as feature, index}
					<button on:click={() => onSelectedLocation(index)}>
						<p>
							<!-- {feature.type ?? ''} -->
							{feature.display_name ?? ''}
						</p>
					</button>
				{/each}
			</div>
		{/if}
	</form>
	{location?.cords?.lat ?? ''}
	{location?.cords?.lon ?? ''}
</div>

<style lang="scss">
	form {
		display: flex;
		position: relative;
	}
	input {
		flex: 1;
		padding: 0.25rem 1rem;
		font-size: 1rem;
		background: none;
		border: none;
		background-color: $color1_d4;
		&::placeholder {
			color: $color1_l3;
		}
	}
	button {
		padding: 0.25rem 1rem;
		font-size: 1rem;
		background: none;
		border: none;
		max-width: 100%;
		background-color: $color1_d4;
		p {
			margin: 0;
			max-width: 100%;
			font-size: 0.8rem;
			text-align: start;
			// white-space: nowrap;
			// overflow: hidden;
			// text-overflow: ellipsis;
			// overflow-x: scroll;
		}
	}
	.location-list {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		max-height: 150px;
		overflow-y: scroll;
		button {
			background-color: $color1_d6;
			&:hover {
				opacity: 1;
				background-color: $color1_d7;
			}
		}
	}
</style>
