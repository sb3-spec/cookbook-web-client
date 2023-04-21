import axios from "axios";
import { backendHost } from "./hosts";

import { getAuth } from "firebase/auth";

export const api = axios.create({
    baseURL: backendHost + "api/",
    headers: {
        "X-Auth-Token": getAuth().currentUser?.uid,
        "Content-Type": "application/json"
    }
});