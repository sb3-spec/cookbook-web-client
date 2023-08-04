<script lang="ts">
  import { onMount } from "svelte";
  import { createChef } from "../api/chef";
  import { handleCreateUserWithEmailAndPassword } from "../auth";
  import { setLoginSpanFocusStyles } from "./utils";

  let password = "";
  let email = "";
  let username = "";

  async function handleCreateUserFormSubmit() {
    const response = await handleCreateUserWithEmailAndPassword(
      email,
      password
    );

    if (response.user == null) {
      return;
    }
    const createChefResponse = await createChef({
      username: response.user.username,
      firebase_id: response.user.uid,
      custom_tags: [],
    });

    if (createChefResponse.chef == null) {
      alert("Unable to create chef on the server");
      return;
    }

    sessionStorage.setItem("chef", JSON.stringify(createChefResponse.chef));

    onMount(() => {
      setLoginSpanFocusStyles();
    });
  }
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
      Create Account
    </h3>
    <form on:submit|preventDefault={handleCreateUserFormSubmit}>
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
            <input
              bind:value={email}
              id="email-input"
              name="email"
              placeholder="Email"
              type="email"
              autocomplete="username"
              required
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
            <input
              type="password"
              bind:value={password}
              id="password-input"
              placeholder="Password"
              autocomplete="new-password"
              required
            />
          </div>
        </span>
        <span id="username">
          <div class="input-email-container">
            <label for="username">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                ><g fill="none" fill-rule="evenodd"
                  ><path
                    d="M24 0v24H0V0h24ZM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01l-.184-.092Z"
                  /><path
                    fill="currentColor"
                    d="M12 2c5.523 0 10 4.477 10 10a9.959 9.959 0 0 1-2.258 6.33l.02.022l-.132.112A9.978 9.978 0 0 1 12 22c-2.95 0-5.6-1.277-7.43-3.307l-.2-.23l-.132-.11l.02-.024A9.958 9.958 0 0 1 2 12C2 6.477 6.477 2 12 2Zm0 15c-1.86 0-3.541.592-4.793 1.405A7.965 7.965 0 0 0 12 20a7.965 7.965 0 0 0 4.793-1.595A8.897 8.897 0 0 0 12 17Zm0-13a8 8 0 0 0-6.258 12.984C7.363 15.821 9.575 15 12 15s4.637.821 6.258 1.984A8 8 0 0 0 12 4Zm0 2a4 4 0 1 1 0 8a4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4Z"
                  /></g
                ></svg
              >
            </label>
            <input
              required
              type="text"
              bind:value={username}
              id="username-input"
              placeholder="Username"
              autocomplete="username"
            />
          </div>
        </span>
        <span
          style="box-sizing: border-box; display: flex; justify-content: space-between;"
        >
          <a
            href="#/login"
            style="cursor: pointer; line-height: 40px; color: var(--main-color); font-weight: 400;"
          >
            Login
          </a>
          <button type="submit" id="login">Create</button>
        </span>
      </div>
    </form>
  </div>
</div>

<style>
  :root {
    --email-input-height: 2em;
  }

  #firebase-auth-container {
    width: 400px;
    margin: 0 auto;
    background-color: var(--text);
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
    gap: 1.5em;
  }

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
  }

  #username,
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

  .email-login label {
    width: 40px;
  }

  .login-outer {
    background-color: var(--background);
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    padding-top: 4em;
  }

  .logo-container {
    display: flex;
    cursor: pointer;
    white-space: nowrap;
    margin: 0 auto;
    padding: 0 10px;
    padding-right: 40px;
    gap: 10px;
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
      background-color: var(--text);
      backdrop-filter: blur(20px);
      border-radius: 0px;
      padding-bottom: 1em;
      box-shadow: none;
    }

    .logo-container {
      padding-bottom: 2em;
    }
  }
</style>
