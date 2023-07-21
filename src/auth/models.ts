import type { User } from "firebase/auth";

interface AuthResponseInterface {
    user?: User,
    errorMessage: string,
    errorCode: number

    setUser(user: User): void;
    setErrorInformation(error: Error): void;
    asJsonString(): string;
}

export class AuthResponse implements AuthResponseInterface {
    errorMessage = "";
    errorCode = 404;
    user;

    setErrorInformation(error: Error): void {
        this.errorMessage = error.message;
    }

    setUser(user: User) {
        this.user = user;
    }

    asJsonString(): string {
        return JSON.stringify(this.user);
    }

    constructor() {}
}