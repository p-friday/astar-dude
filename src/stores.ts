import { writable } from "svelte/store";

export const isMouseDown = writable(false);
export const shouldWall = writable(false);