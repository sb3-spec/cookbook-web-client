import axios from "axios";

import { getRecipes } from "./recipeFunctions";
import { backendHost } from "../utils/hosts";

export const api = axios.create({
    baseURL: backendHost + "api/",
    headers: {
        "Content-Type": "application/json"
    }
});

// module.exports = {
//     getRecipes, 
// }