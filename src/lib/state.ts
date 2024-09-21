import { writable } from "svelte/store";

export const answerLog = writable<Record<number, string[]>>({});
export const surveyResults = writable<number[]>([]);
export const score = writable<number>(0);
