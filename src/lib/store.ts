import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { uuid } from './util';

export const MINUTES_HOUR = 60;

export enum Rating {
	meh = 1,
	good = 2,
	must = 3
}

export type IEventID = string;
export type IItineraryID = string;

export interface ISimpleEvent {
	start: number;
	end: number;
	eventId: IEventID;
	cords: { lat: number; lon: number } | null;
}

export interface ITravelTime {
	startEventId: IEventID;
	endEventId: IEventID;
	duration: number;
	distance: number;
}

export interface IEvent {
	id: IEventID;
	name: string;
	rating: Rating;
	location: {
		name: string;
		cords: {
			lat: number;
			lon: number;
		} | null;
	} | null;
	plan: {
		itineraryId: IItineraryID;
		startTime: number;
		endTime: number;
	} | null;
}

export interface IItinerary {
	id: IItineraryID;
	startTime: number;
	endTime: number;
	startEvent?: IEventID;
	eventIds: IEventID[];
	endEvent?: IEventID;
}

export interface IDaySlotElement {
	slotData: IItinerary;
	element: Element;
}

export const events = writable<IEvent[]>([]);
export const itineraries = writable<IItinerary[]>([
	{
		id: uuid(),
		startTime: 8 * MINUTES_HOUR,
		endTime: 20 * MINUTES_HOUR,
		eventIds: []
	}
]);

export const overDaySlotElement = writable<IDaySlotElement | null>(null);
export const zoom = writable(1);

export interface IDraggedEvent {
	pointerEvent: PointerEvent;
	eventId: IEventID;
	boundingRect: DOMRect;
}

export const draggedEvent = writable<IDraggedEvent | null>(null);
export const expandedEvent = writable<IEventID | null>(null);

// dynamic id mapper
type IEventIDToIndexMapItem = { [key: IEventID]: number };
export const eIdToI = writable<IEventIDToIndexMapItem>({});
events.subscribe((events) => {
	eIdToI.update(() =>
		events.reduce((map, event, index) => {
			map[event.id] = index;
			return map;
		}, {} as IEventIDToIndexMapItem)
	);
});

type IItineraryIDToIndexMapItem = { [key: IEventID]: number };
export const iIdToI = writable<IItineraryIDToIndexMapItem>({});
itineraries.subscribe((itineraries) => {
	iIdToI.update(() =>
		itineraries.reduce((map, itinerary, index) => {
			map[itinerary.id] = index;
			return map;
		}, {} as IItineraryIDToIndexMapItem)
	);
});
