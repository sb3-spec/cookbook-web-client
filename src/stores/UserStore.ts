import { writable } from "svelte/store";
import { Chef } from "../utils/customTypes";

export const UserStore = writable<Chef>(
  JSON.parse(localStorage.getItem("chef"))
);
