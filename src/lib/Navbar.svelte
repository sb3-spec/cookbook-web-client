<script lang="ts">
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { frontendHost } from "../utils/hosts";
  import { onMount } from "svelte";
  import { CurrentRecipeStore } from "../stores/CurrentRecipe";
  import { Recipe } from "../utils/customTypes";
  import { YourRecipesStore } from "../stores/RecipeListStore";

  $: showNav = false;
  $: logoutModalActive = false;
  let userName = "";
  let mobileNavActive = false;

  $: currentPage = window.location.href;

  onMount(() => {
    currentPage = window.location.href;
  });

  function toggleMobileNav() {
    mobileNavActive = !mobileNavActive;

    let el = document.querySelector(".mobile-nav");
    if (mobileNavActive) {
      el.setAttribute("style", "transform: translateX(0);");
    } else {
      el.setAttribute("style", "transform: translateX(100%);");
    }
  }

  let auth = getAuth();
  async function handleLogout() {
    auth
      .signOut()
      .then(() => {
        YourRecipesStore.set([]);
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        logoutModalActive = false;
      });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      showNav = true;
      userName = user.displayName;
    } else {
      showNav = false;
    }
  });
</script>

{#if showNav && !window.location.href.includes("login")}
  <div class="navbar-outer">
    <div
      class="logo-container"
      role="button"
      tabindex="0"
      on:click={() => {
        window.location.href = frontendHost + "#/";
        currentPage = "/#/";
      }}
      on:keypress={() => {
        window.location.replace("/#/");
      }}
    >
      <span class="img-helper" /><img
        src="./assets/parsley.png"
        alt="Sprig of parsley"
      />
      <h2>Parsley</h2>
    </div>
    <nav id="main-nav">
      <!-- <a href="/#/recipes">Your Recipes</a> -->
      <a href="/#/">Dashboard</a>
      <!-- <a href="/#/explore">Explore</a> -->
      <a
        on:click={() => {
          CurrentRecipeStore.set(new Recipe());
        }}
        href="/#/new-recipe"
        id="new-recipe">New Recipe</a
      >
      <button class="logout" on:click|preventDefault={toggleMobileNav}>
        <p>Sign out</p>
        <svg
          id="mobile-hamburger"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 21 21"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 6.5h12m-12.002 4h11.997M4.5 14.5h11.995"
          />
        </svg>
      </button>
    </nav>
  </div>

  <nav class="mobile-nav">
    <div class="mobile-nav-links">
      <a class="mobile-nav-item" href="/"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 21 21"
          ><path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.5 3.5h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2zm1 14v-14"
          /></svg
        >Your Recipes</a
      >
      <a on:click={toggleMobileNav} class="mobile-nav-item" href="#/new-recipe">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 21 21"
        >
          <g
            fill="none"
            fill-rule="evenodd"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path
              d="M10 4.5H5.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V11"
            />
            <path
              d="M17.5 3.467a1.462 1.462 0 0 1-.017 2.05L10.5 12.5l-3 1l1-3l6.987-7.046a1.409 1.409 0 0 1 1.885-.104zm-2 2.033l.953 1"
            />
          </g>
        </svg>New Recipe</a
      >
      <span
        class="mobile-nav-item"
        role="button"
        tabindex="0"
        on:click|preventDefault={() => {
          toggleMobileNav();
          logoutModalActive = true;
        }}
        on:keydown|preventDefault={() => {
          toggleMobileNav();
          logoutModalActive = true;
        }}
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 21 21"
          ><g fill="none" fill-rule="evenodd" transform="translate(4 3)"
            ><path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.5.5h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2z"
            /><path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m10.202 14.5l-3.645-1.948A2 2 0 0 1 5.5 10.788V4.212a2 2 0 0 1 1.057-1.764L10.202.5"
            /><circle cx="7.5" cy="7.5" r="1" fill="currentColor" /></g
          ></svg
        >Sign Out</span
      >
    </div>
  </nav>
{/if}

{#if logoutModalActive}
  <div class="logout-modal">
    <div class="logout-wrapper">
      <h3>Confirm logout?</h3>
      <div style="display: flex; justify-content: center; gap: 20px;">
        <button
          on:click={async () => {
            await handleLogout();
          }}>Yes</button
        >
        <button
          on:click|preventDefault={() => {
            logoutModalActive = false;
          }}>No</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  #mobile-hamburger {
    display: none;
  }
  .logout-modal {
    position: absolute;
    margin: 0 auto;
    z-index: 15;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0 0 0 / 0.8);
  }

  .mobile-nav {
    display: none;
  }

  .logout-modal h3 {
    color: white;
    font-weight: 300;
    font-size: 30px;
  }

  .img-helper {
    display: inline-block;
    height: 60px;
    vertical-align: middle;
  }

  .logout-wrapper {
    margin: 0 auto;
    position: relative;
    bottom: -40%;
    backdrop-filter: blur(20px);
    background-color: rgba(54, 54, 54, 0.8);
    width: 400px;
    padding: 2em;
    border-radius: 15px;
  }

  .logo-container {
    display: flex;
    cursor: pointer;
    white-space: nowrap;
    margin: 0 auto;
    position: absolute;
    border-right: 1px solid var(--contrast-border);
    padding: 0 10px;
    padding-right: 40px;
    gap: 10px;
  }

  .logo-container img {
    height: 35px;
    display: block;
    margin: auto;
  }

  h2 {
    font-size: 32px;
    margin: 0;
    color: var(--main-color);
    line-height: 60px;
    position: relative;
  }
  .navbar-outer {
    border-bottom: 1px solid var(--contrast-border);
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* padding-bottom: 3px; */
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 15;
    padding-left: 2em;
    background-color: var(--navbar-color);
    color: var(--text-color);
  }

  nav {
    display: flex;
    flex-direction: row;
    height: 100%;
    gap: 30px;
    padding-right: 30px;
    position: absolute;
    right: 0;
  }

  #main-nav a {
    font-size: 15px;
    font-weight: 600;
    margin: 0;
    vertical-align: middle;
    line-height: 60px;
    transition: all 100ms ease;
    color: var(--text-color);
  }

  .logout {
    padding: 0px;
    color: var(--text-color);
    background-color: transparent;
    border: none;
    transition: all ease 100ms;
    font-weight: 600;
    font-size: 15px;
    border-radius: 0;
  }

  .logout-modal button {
    color: white;
    background-color: transparent;
    border: 2px solid white;
  }

  .logout-modal button:hover {
    background-color: white;
    color: black;
  }

  .logout p:hover {
    border-bottom: none;
  }

  p {
    margin: 0;
    line-height: 60px;
    vertical-align: middle;
    transition: all 100ms ease;
  }

  p:hover {
    border-bottom: 5px solid var(--primary-button);
  }

  .logout:focus-visible {
    outline: none;
  }

  @media (min-width: 1001px) {
    a:hover {
      border-bottom: 5px solid var(--main-color);
    }
  }

  @media (max-width: 1000px) {
    .navbar-outer {
      /* position: fixed; */
      top: 0;
      padding: 0;
      justify-content: center;
      width: 100%;
    }

    .navbar-outer a {
      display: none;
    }

    .navbar-outer button {
      left: 0;
    }

    #mobile-hamburger {
      display: block;
    }

    .mobile-nav {
      display: flex;
      z-index: 20;
      position: fixed;
      right: 0;
      top: 60px;
      height: 100vh;
      background-color: var(--mobile-nav-bg);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(56, 56, 56, 0.2);
      border-right: none;
      width: 175px;
      box-sizing: border-box;
      padding: 0;
      transition: all 300ms ease;
      transform: translateX(100%);
    }

    .mobile-nav-links {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 10px;
    }

    .mobile-nav-item {
      height: max-content;
      width: 100%;
      color: var(--text-color);
      width: 100%;
      padding: 10px 10px;
      box-sizing: border-box;
      border-radius: 3px;
      font-weight: 500;
      position: relative;
    }

    .mobile-nav-item svg {
      position: absolute;
      left: 10px;
    }

    .mobile-nav-item:active {
      backdrop-filter: brightness(80%);
    }

    #main-nav a {
      line-height: 100%;
      vertical-align: middle;
      display: none;
    }

    /* nav {
            padding: 0;
            right: 10px;
            position: absolute;
        } */

    button p {
      display: none;
    }

    .logo-container {
      margin: 0;
      border-right: none;
    }

    .logo-container h2 {
      display: inline;
      font-size: 20px;
      line-height: 60px;
      vertical-align: middle;
      height: auto;
    }

    .logo-container img {
      height: 35px;
      line-height: 60px;
      vertical-align: middle;
    }

    .logout-wrapper {
      width: 300px;
    }

    .logout-wrapper button {
      width: 80%;
      margin-top: 10px;
      background-color: button-primary;
      border: 1px solid black;
    }
  }
</style>
