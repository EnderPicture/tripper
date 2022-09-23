import { writable } from 'svelte/store';

export enum Rating {
	meh = 1,
	good = 2,
	must = 3
}

export interface IEvent {
	name: string;
	rating: Rating;
	location: {
		lat: number;
		lon: number;
	} | null;
}

export interface IEventBlock {
	startTime: number;
	endTime: number;
	event: IEvent;
}

export interface IDaySlotData {
	startTime: number;
	endTime: number;
	startEvent?: IEventBlock;
	events: IEventBlock[];
	endEvent?: IEventBlock;
}

export const daysStore = writable<IDaySlotData[]>([
	{
		startTime: 8 * 60,
		endTime: 20 * 60,
		events: []
	}
]);
export const zoom = writable(1);
export const eventsStore = writable<IEvent[]>([]);
