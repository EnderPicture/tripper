import { writable } from "svelte/store";

enum Rating {
  meh = 1,
  good = 2,
  must = 3,
}

export interface Event {
  name: string;
  rating: Rating;
}

export interface IEventBlock {
  startTime: number,
  endTime: number,
}

export interface IDaySlotData {
  startTime: number,
  endTime: number,
  startEvent?: IEventBlock,
  events: IEventBlock[],
  endEvent?: IEventBlock,
}

export const daysStore = writable<IDaySlotData[]>([
  {
    startTime: 8*60,
    endTime: 20*60,
    events: [],
  }
]);
export const zoom = writable(1);