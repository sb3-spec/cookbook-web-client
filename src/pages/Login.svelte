<script lang="ts">
  import { onMount } from "svelte";
  import { setLoginSpanFocusStyles } from "./utils";

  import {
    handleGoogleAuth,
    handleLoginWithEmailAndPassword,
  } from "../auth/index";
  import { getChef } from "../api/chef";

  let email = "";
  let password = "";

  onMount(() => {
    setLoginSpanFocusStyles();
  });
</script>

<div class="login-outer">
  <div class="logo-container">
    <img src="./assets/parsley.png" alt="Cookbook icon" />
    <h2 style="color: var(--main-color);font-size: 60px; margin: 0;">
      Parsley
    </h2>
  </div>
  <div id="firebase-auth-container">
    <h3 style="font-weight: 400;font-size: 30px;margin: 0; margin-bottom: 1em;">
      Login
    </h3>
    <div class="email-login">
      <span id="email">
        <div class="input-email-container">
          <label for="email">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22"
              width="22"
              viewBox="0 0 32 32"
            >
              <path
                fill="currentColor"
                d="M28 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Zm-2.2 2L16 14.78L6.2 8ZM4 24V8.91l11.43 7.91a1 1 0 0 0 1.14 0L28 8.91V24Z"
              />
            </svg>
          </label>
          <input type="text" style="display: none;" />
          <input
            bind:value={email}
            id="email-input"
            name="email"
            placeholder="Email"
            type="email"
            autocomplete="username"
          />
        </div>
      </span>

      <span id="password">
        <div class="input-email-container">
          <label for="password">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22"
              width="22"
              viewBox="0 0 32 32"
            >
              <path
                fill="currentColor"
                d="M24 14h-2V8a6 6 0 0 0-12 0v6H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V16a2 2 0 0 0-2-2ZM12 8a4 4 0 0 1 8 0v6h-8Zm12 20H8V16h16Z"
              />
            </svg>
          </label>
          <input type="text" style="display: none;" />
          <input
            type="password"
            bind:value={password}
            id="password-input"
            placeholder="Password"
            autocomplete="current-password"
          />
        </div>
        <p
          style={`line-height: 32px; color: var(--main-color); padding:0 12px; position: relative;`}
        >
          Forgot?
        </p>
      </span>
      <span
        style="box-sizing: border-box; display: flex; justify-content: space-between;"
      >
        <a
          href="#/sign-up"
          style="cursor: pointer; line-height: 40px; color: var(--main-color); font-weight: 400;"
        >
          Create an account
        </a>
        <button
          type="button"
          id="login"
          on:click|preventDefault={async () => {
            await handleLoginWithEmailAndPassword(email, password);
          }}>Login</button
        >
      </span>
    </div>
    <div class="provider-login">
      <p style="font-weight: bold;">or</p>
      <button
        type="button"
        on:click={async () => {
          await handleGoogleAuth();
        }}
        class="google"
      >
        Continue with Google
      </button>
    </div>
  </div>
</div>

<style>
  :root {
    --email-input-height: 2em;
  }

  #firebase-auth-container {
    width: 400px;
    margin: 0 auto;
    background-color: var(--login-bg);
    backdrop-filter: blur(20px);
    border-radius: 4px;
    padding-bottom: 1em;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    display: flex;
    flex-direction: column;
    padding-top: 1em;
  }

  .input-email-container {
    display: flex;
  }

  .email-login {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 80%;
    position: relative;
    padding-bottom: 1.6em;
  }

  .email-login p {
    margin: 0;
    cursor: pointer;
  }

  .email-login p:hover,
  .email-login a:hover {
    text-decoration: underline;
  }

  .email-login input {
    height: 100%;
    border: none;
    padding: 0;
    font-size: 14px;
  }

  .email-login svg {
    position: relative;
    top: 6px;
  }

  .email-login input:focus-visible {
    outline: none;
    background-color: transparent !important;
  }

  .email-login input:autofill,
  .email-login input:-webkit-autofill {
    background-color: transparent !important;
  }

  #email,
  #password {
    height: 50px;
    border: 2px solid var(--login-contrast-border);
    border-radius: 3px;
    display: flex;
    margin: 0 auto;
    padding: 5px 2px;
    width: 100%;
    justify-content: space-between;
    box-sizing: border-box;
  }

  #email {
    margin-bottom: 1.5em;
  }

  #password {
    margin-bottom: 1em;
  }

  #password p::before {
    display: inline;
    position: absolute;
    content: "";
    background-color: rgb(206, 206, 206);
    width: 2px;
    height: 100%;
    left: 0;
  }

  .email-login label {
    width: 40px;
  }

  .login-outer {
    background-color: var(--background);
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .logo-container {
    display: flex;
    cursor: pointer;
    white-space: nowrap;
    margin: 0 auto;
    padding: 0 10px;
    gap: 10px;
    padding-bottom: 1em;
  }

  .logo-container img {
    height: 90px;
    display: block;
    margin: auto;
  }

  #login {
    width: 8em;
    border: none;
    border-radius: 3px;
    background-color: var(--main-color);
    color: white;
  }

  .provider-login {
    padding-top: 3em;
    padding-bottom: 2em;
    width: 80%;
    margin: 0 auto;
    position: relative;
    margin-top: 2em;
  }

  .provider-login p {
    position: absolute;
    top: 5px;
    right: 40px;
    left: 40px;
    margin: 0;
  }

  .provider-login::before {
    position: absolute;
    top: 0;
    left: 30px;
    right: 30px;
    content: "";
    height: 2px;
    background-color: var(--main-color);
  }

  .provider-login button {
    height: 50px;
    border: none;
    width: 100%;
    border-radius: 5px;
  }

  .google {
    background-color: #4c8bf5;
    color: white;
  }

  @media (max-width: 1000px) {
    h2 {
      font-size: 40px;
    }

    .logo-container img {
      height: 40px;
    }

    #firebase-auth-container {
      width: 100%;
      margin: 0 auto;
      border-radius: 0;
      background-color: var(--text);
      backdrop-filter: blur(20px);
      padding-bottom: 1em;
      padding-top: 0;
      box-shadow: none;
    }
  }
</style>
