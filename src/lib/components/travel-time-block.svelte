<script lang="ts">
	import { eIdToI, events, type IItinerary, type ITravelTime } from '$lib/store';
	import { getCenter } from '$lib/util';

	export let travelTime: ITravelTime;
	export let itinerary: IItinerary;

	let startTime = 0;
	let endTime = 0;
	let durationMins = 0;

	$: {
		const startPlan = $events[$eIdToI[travelTime.startEventId]].plan;
		const endPlan = $events[$eIdToI[travelTime.endEventId]].plan;

		durationMins = travelTime.duration / 60;

		if (startPlan && endPlan) {
			const startFreeTime = startPlan.endTime - itinerary.startTime;
			const endFreeTime = endPlan.startTime - itinerary.startTime;

			const center = getCenter(startFreeTime, endFreeTime);
			const half = durationMins / 2;
			startTime = center - half;
			endTime = center + half;
		}
	}
</script>

<div
	class="travel-block"
	style={`transform: translateY(${startTime}px); height: ${durationMins}px`}
>
	<p>{durationMins / 60} hours</p>
	<p>{travelTime.distance / 1000} km</p>
</div>

<style>
	.travel-block {
		position: absolute;
		top: 0;
		left: 0;
		background-color: rebeccapurple;
		transition: 0.2s ease;
	}
</style>
