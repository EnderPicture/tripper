<script lang="ts">
	import { eIdToI, events, UNIX_HOUR, zoom, type IItinerary, type ITravelTime } from '$lib/store';
	import { getCenter } from '$lib/util';
	import dayjs from 'dayjs';
	import dayjsDuration from 'dayjs/plugin/duration';
	dayjs.extend(dayjsDuration);

	export let travelTime: ITravelTime;
	export let itinerary: IItinerary;

	$: duration = travelTime.duration;

	let height = 0;
	let start = 0;

	$: {
		const startPlan = $events[$eIdToI[travelTime.startEventId]].plan;
		const endPlan = $events[$eIdToI[travelTime.endEventId]].plan;

		if (
			startPlan &&
			endPlan &&
			startPlan.itineraryId === itinerary.id &&
			endPlan.itineraryId === itinerary.id
		) {
			const startFreeTime = startPlan.endTime - itinerary.startTime;
			const endFreeTime = endPlan.startTime - itinerary.startTime;

			const center = getCenter(startFreeTime, endFreeTime);

			height = (duration / UNIX_HOUR) * $zoom;
			start = ((center - duration / 2) / UNIX_HOUR) * $zoom;
		}
	}
</script>

<div class="travel-block" style={`transform: translateY(${start}px); height: ${height}px`}>
	<div class="inner">
		<div class="info">
			<p><strong>{travelTime.distance / 1000}</strong>km</p>
			<p class="time">
				<strong>{dayjs.duration(duration, 'seconds').format('H[h] m[min]')}</strong>
			</p>
		</div>
	</div>
</div>

<style lang="scss">
	.travel-block {
		position: absolute;
		top: 0;
		left: 0;
		padding: 0 1rem;
		width: 100%;
		pointer-events: none;
	}
	p {
		margin: 0;
	}
	.inner {
		padding: 1rem;
		background-color: rgba(lighten($color2, 10), 0.2);
		width: 50%;
		margin-right: auto;
		margin-left: auto;
		width: 15rem;
		max-width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		border-radius: 0.5rem;
	}
	.info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	strong {
		font-size: 1.2rem;
	}
</style>
