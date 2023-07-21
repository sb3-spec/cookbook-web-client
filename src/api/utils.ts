import { getAuth } from "firebase/auth";
import { app } from "../utils/firebase";

export function getAuthConfig() {
    let user = getAuth(app).currentUser;
    

    let authConfig = {
        headers: {
            'X-AUTH-TOKEN': user?.uid || '',
        }

    }

    return authConfig;
}
