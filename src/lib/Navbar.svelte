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

  $: currentPage = window.location.href;

  onMount(() => {
    currentPage = window.location.href;
  });

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
    <nav>
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
      <button
        class="logout"
        on:click|preventDefault={() => {
          logoutModalActive = true;
        }}
      >
        <p>Sign out</p>
        <img src="./assets/nav-icons/logout.png" alt="logout icon" />
      </button>
    </nav>
  </div>

  <nav class="mobile-nav">
    <a
      href="/#/"
      on:click={() => {
        currentPage = "/#/";
      }}
    >
      {#if currentPage === frontendHost || currentPage.endsWith("/")}
        <img src={"./assets/nav-icons/house.png"} alt="Home symbol" />
      {:else}
        <img src={"./assets/nav-icons/house_inactive.png"} alt="Home symbol" />
      {/if}
    </a>
    <a
      href="/#/new-recipe"
      on:click={() => {
        currentPage = "new-recipe";
        CurrentRecipeStore.set(new Recipe());
      }}
    >
      {#if currentPage.endsWith("new-recipe")}
        <img src="./assets/nav-icons/tab.png" alt="New Recipe Symbol" />
      {:else}
        <img
          src="./assets/nav-icons/tab_inactive.png"
          alt="New Recipe Symbol"
        />
      {/if}
    </a>
  </nav>
{/if}

{#if logoutModalActive}
  <div class="logout-modal">
    <div class="logout-wrapper">
      <h3>Confirm logout?</h3>
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
{/if}

<style>
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
    border-right: 1px solid #bdbdbd;
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
    background-color: white;
    border-bottom: 1px solid #bdbdbd;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* padding-bottom: 3px; */
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 10;
    padding-left: 2em;
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

  button img {
    display: none;
  }

  nav a {
    font-size: 15px;
    color: black;
    font-weight: 600;
    margin: 0;
    /* position: relative;
        bottom: -20px; */
    vertical-align: middle;
    line-height: 60px;
    transition: all 100ms ease;
  }

  .logout {
    padding: 0px;
    color: white;
    background-color: transparent;
    border: none;
    transition: all ease 100ms;
    font-weight: 600;
    font-size: 15px;
  }

  .logout p:hover {
    border-bottom: none;
  }

  .logout:hover {
    border: none;
    border-bottom: 5px solid var(--main-color);
    border-radius: 0;
  }

  p {
    margin: 0;
    line-height: 60px;
    vertical-align: middle;
    transition: all 100ms ease;
    color: black;
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

    .mobile-nav {
      display: flex;
      gap: 80px;
      justify-content: center;
      position: fixed;
      bottom: 0;
      left: 0;
      height: 60px;
      background-color: rgba(56, 56, 56, 0.8);
      z-index: 14;
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(56, 56, 56, 0.2);
      width: 100%;
      box-sizing: border-box;
    }

    .mobile-nav a {
      display: inline-block;
      color: white;
      line-height: 60px;
    }

    nav a {
      line-height: 100%;
      vertical-align: middle;
      display: none;
    }

    .mobile-nav a img {
      width: 28px;
      height: 28px;
      vertical-align: middle;
    }

    /* nav {
            padding: 0;
            right: 10px;
            position: absolute;
        } */

    button img {
      display: flex;
      width: 20px;
      height: 20px;
    }

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
