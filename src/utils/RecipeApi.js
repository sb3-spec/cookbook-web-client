import axios from "axios";
import { backendHost } from "./hosts";

export const api = axios.create({
    baseURL: backendHost + "api/",
    headers: {
        "X-Auth-Token": "123",
        "Content-Type": "application/json"
    }
});