import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const MINUTES_HOUR = 60;

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
	startEvent?: IEvent;
	events: IEventBlock[];
	endEvent?: IEvent;
}
export interface IDaySlotElement {
	slotData: IDaySlotData;
	element: Element;
}

export interface ISelectedEventDown {
	pointerEvent: PointerEvent;
	event: IEvent;
  boundingRect: DOMRect;
}

export const daysStore = writable<IDaySlotData[]>([
	{
		startTime: 8 * MINUTES_HOUR,
		endTime: 20 * MINUTES_HOUR,
		events: []
	}
]);
export const overDaySlotElement = writable<IDaySlotElement | null>(null);
export const zoom = writable(1);
export const eventsStore = writable<IEvent[]>([]);

export const selectedEvent = writable<ISelectedEventDown | null>(null);
