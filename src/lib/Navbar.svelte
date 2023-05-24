<script>
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { frontendHost } from "../utils/hosts";
    import { onMount } from "svelte";

    $: showNav = false;
    $: logoutModalActive = false;
    let userName = "";

    let currentPage = window.location.href;

    onMount(() => {
        currentPage = window.location.href;
        console.log(currentPage);
    })

    let auth = getAuth();
    async function handleLogout() {
        auth.signOut().then(() => {
            console.log("User successfully logged out")
        }).catch(err => {
            alert(err.message);
        }).finally(() => {
            logoutModalActive = false;
        });;
    }

    onAuthStateChanged(auth, user => {
        if (user) {
            showNav = true;
            userName = user.displayName;
        } else {
            showNav = false;
        }
    });
</script>

{#if showNav && !window.location.href.includes('login')}

    <div class="navbar-outer">
        <div class="logo-container" on:click={() => {
            window.location.href = frontendHost + "#/";
            currentPage = '/#/'
            }} on:keypress={() => {window.location.replace("/#/")}}>
            <span class='img-helper'></span><img src="./assets/cookbook.png" alt="Cookbook icon">
            <h2>Cookbook</h2>
        </div>
        <nav>
            <!-- <a href="/#/recipes">Your Recipes</a> -->
            <a href="/#/" >Dashboard</a>
            <!-- <a href="/#/explore">Explore</a> -->
            <a href="/#/new-recipe" id="new-recipe">New Recipe</a>
            <button class="logout" on:click|preventDefault={() => {logoutModalActive = true}}><p>Sign out</p><img src="./assets/nav-icons/logout.png" alt="logout icon" /></button>
        </nav>
        
    </div>

    <nav class="mobile-nav">
        <a href="/#/" on:click={() => {currentPage="/#/"}}>
            {#if currentPage === frontendHost || currentPage.endsWith('/')}
                <img src={"./assets/nav-icons/house.png"} alt="Home symbol">
            {:else}
                <img src={"./assets/nav-icons/house_inactive.png"} alt="Home symbol">
            {/if}
        </a>
        <a href="/#/new-recipe" on:click={() => {currentPage="new-recipe"}}>
            {#if currentPage.endsWith("new-recipe")}
                <img src="./assets/nav-icons/tab.png" alt="New Recipe Symbol">
            {:else}
                <img src="./assets/nav-icons/tab_inactive.png" alt="New Recipe Symbol">
            {/if}
        </a>
    </nav>
{/if}

{#if logoutModalActive}
    <div class="logout-modal">
        <div class="logout-wrapper">
            <h3>Confirm logout?</h3>
            <button on:click={handleLogout}>Yes</button>
            <button on:click|preventDefault={() => {logoutModalActive = false;}}>No</button>
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
        background-color: rgba(0 0 0 / .8);
    }

    

    .mobile-nav {
        display: none;
    }

    .logout-modal h3 {
        color: var(--text);
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
        background-color: rgba(54, 54, 54, .8);
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

    nav {
        position: absolute;
        right: 0;
    }


    h2 {
        font-size: 32px;
        margin: 0;
        color: var(--primary-button);
        line-height: 60px;
        position: relative;
    }
    .navbar-outer {
        background-color: white;
        border-bottom: 1px solid #bdbdbd;
        position: relative;
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        /* padding-bottom: 3px; */
        position: sticky;
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

    a:hover {
        border-bottom: 5px solid var(--primary-button);
    }

    .logout {
        padding: 0px;
        color: var(--text);
        background-color: transparent;
        border: none;
        transition: all ease 100ms;
        font-weight: 600;
        font-size: 15px;
    }

    .logout  p:hover {
        border-bottom: none;
    }

    .logout:hover {
        border: none;
        border-bottom: 5px solid var(--primary-button);
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

    @media (max-width: 900px) {
        .navbar-outer {
            position: fixed;
            top: 0;
            width: 100%;
            padding: 0;
            justify-content: center;
        }

        .mobile-nav {
            display: flex;
            gap: 80px;
            justify-content: center;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60px;
            background-color: rgba(56, 56, 56, .8);
            z-index: 14;
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(56, 56, 56, .2);

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

        nav {
            padding: 0;
            right: 10px;
            position: absolute;
        }

        button img {
            display: inline-block;
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