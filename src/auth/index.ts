import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  type UserCredential,
  type User,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { app } from "../utils/firebase";

import { UserStore } from "../stores/UserStore";
import { frontendHost } from "../utils/hosts";

// Module imports
import { AuthResponse } from "./models";
import { createChef } from "../api/chef";

const auth = getAuth(app);
auth.useDeviceLanguage();

const googleProvider = new GoogleAuthProvider();

export async function handleGoogleAuth(): Promise<AuthResponse> {
  let response = new AuthResponse();

  try {
    // Try to authenticate with Google
    let result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.

    const credential = GoogleAuthProvider.credentialFromResult(result);

    const token = credential.accessToken;

    // The signed-in user info.
    UserStore.set(result.user);
    response.setUser(result.user);
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    window.location.href = frontendHost;
  } catch (error) {
    // Handle Errors here.
    response.setErrorInformation(error);
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);

    if (error.code === "auth/account-exists-with-different-credential") {
      const methods = await fetchSignInMethodsForEmail(getAuth(app), email);

      // Step 3.
      // If the user has several sign-in methods,
      // the first method in the list will be the "recommended" method to use.
      if (methods[0] === "password") {
      }
    }
    // ...
  }
  return response;
}

export async function handleCreateUserWithEmailAndPassword(
  email: string,
  password: string
) {
  let response = new AuthResponse();
  let result: UserCredential;

  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    response.setErrorInformation(e);
    return response;
  }
  UserStore.set(result.user);
  response.setUser(result.user);
  window.location.href = frontendHost;

  return response;
}

export async function handleLoginWithEmailAndPassword(
  email: string,
  password: string
) {
  let response = new AuthResponse();

  let result: UserCredential;

  try {
    result = await signInWithEmailAndPassword(auth, email, password);
    UserStore.set(result.user);
    response.setUser(result.user);
    window.location.href = frontendHost;
  } catch (err) {
    response.setErrorInformation(err);
  }
  return response;
}
