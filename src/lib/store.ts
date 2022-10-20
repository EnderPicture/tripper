import { browser } from '$app/environment';
import dayjs from 'dayjs';
import { writable } from 'svelte/store';
import { uuid } from './util';

export const UNIX_HOUR = dayjs.unix(0).add(1, 'hour').unix();

export enum Rating {
	meh = 1,
	good = 2,
	must = 3
}

export enum EventBlockType {
	start,
	mid,
	end
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

export interface IPlan {
	itineraryId: IItineraryID;
	startTime: number;
	endTime: number;
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
	plan: IPlan | null;
}

export interface IItinerary {
	id: IItineraryID;
	startTime: number;
	endTime: number;
	startEvent: IEventID | null;
	eventIds: IEventID[];
	endEvent: IEventID | null;
	travelTimes: ITravelTime[] | null;
}

export interface IDaySlotElement {
	slotData: IItinerary;
	element: Element;
}

export const events = writable<IEvent[]>([]);
export const itineraries = writable<IItinerary[]>([
	{
		id: uuid(),
		startTime: dayjs().startOf('day').add(8, 'hour').unix(),
		endTime: dayjs().startOf('day').add(20, 'hour').unix(),
		eventIds: [],
		startEvent: null,
		endEvent: null,
		travelTimes: null
	},
	{
		id: uuid(),
		startTime: dayjs().startOf('day').add(8, 'hour').unix(),
		endTime: dayjs().startOf('day').add(20, 'hour').unix(),
		eventIds: [],
		startEvent: null,
		endEvent: null,
		travelTimes: null
	}
]);

export const overDaySlotElement = writable<IDaySlotElement | null>(null);
export const zoom = writable(60);

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

// saving 
const save = () => {
	if (browser) {
		localStorage.setItem('itineraries', JSON.stringify(currentItineraries));
		localStorage.setItem('events', JSON.stringify(currentEvents));
	}
};

let currentEvents: IEvent[];
let currentItineraries: IItinerary[];
if (browser) {
	// loading save data
	let savedEvents = localStorage.getItem('events');
	if (savedEvents) {
		events.set(JSON.parse(savedEvents as string) as IEvent[]);
	}

	let savedItineraries = localStorage.getItem('itineraries');
	if (savedItineraries) {
		itineraries.set(JSON.parse(savedItineraries as string) as IItinerary[]);
	}

	// save implementation
	events.subscribe((updatedEvents) => {
		currentEvents = updatedEvents;
		save();
	});
	itineraries.subscribe((updatedItineraries) => {
		currentItineraries = updatedItineraries;
		save();
	});
}
