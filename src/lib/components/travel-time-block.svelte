<script lang="ts">
	import { eIdToI, events, type IItinerary, type ITravelTime } from '$lib/store';
	import { getCenter } from '$lib/util';

	export let travelTime: ITravelTime;
	export let itinerary: IItinerary;

	let startTime = 0;
	let endTime = 0;
	let totalDurationMins = 0;

	$: displayDistance = Math.round(travelTime.distance / 1000).toLocaleString();

	$: hoursDuration = Math.floor(totalDurationMins / 60);
	$: minutesDuration = Math.floor(totalDurationMins % 60);

	$: {
		const startPlan = $events[$eIdToI[travelTime.startEventId]].plan;
		const endPlan = $events[$eIdToI[travelTime.endEventId]].plan;

		totalDurationMins = travelTime.duration / 60;

		if (startPlan && endPlan) {
			const startFreeTime = startPlan.endTime - itinerary.startTime;
			const endFreeTime = endPlan.startTime - itinerary.startTime;

			const center = getCenter(startFreeTime, endFreeTime);
			const half = totalDurationMins / 2;
			startTime = center - half;
			endTime = center + half;

			const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'narrow' });
		}
	}
</script>

<div
	class="travel-block"
	style={`transform: translateY(${startTime}px); height: ${totalDurationMins}px`}
>
	<div class="inner">
		<p class="time"><strong>{hoursDuration}</strong>h <strong>{minutesDuration}</strong>min</p>
		<p><strong>{displayDistance}</strong>km</p>
	</div>
</div>

<style lang="scss">
	.travel-block {
		position: absolute;
		top: 0;
		left: 0;
		transition: 0.2s ease;
		padding: 0 60px;
		width: 100%;
	}
	p {
		margin: 0;
	}
	.inner {
		padding: 1rem;
		background-color: lighten($color2, 10);
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		border-radius: 0.5rem;
		gap: 1rem;
	}
	strong {
		font-size: 1.2rem;
	}
</style>
