import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const MINUTES_HOUR = 60;

export enum Rating {
	meh = 1,
	good = 2,
	must = 3
}

export type IEventID = string;

export interface IEvent {
	id: IEventID;
	name: string;
	rating: Rating;
	location: {
		name: string;
		lat: number | null;
		lon: number | null;
	} | null;
	plan: {
		startTime: number | null;
		endTime: number | null;
	} | null;
}

export interface IItinerary {
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

type IIDToIndexMapItem = { [key: IEventID]: number };
export const idToI = writable<IIDToIndexMapItem>({});
events.subscribe((events) => {
	idToI.update(() =>
		events.reduce((map, event, index) => {
			map[event.id] = index;
			return map;
		}, {} as IIDToIndexMapItem)
	);
});
