import { writable } from "svelte/store";

export const surveyResults = writable<number[]>([]);
export const score = writable<number>(0);
