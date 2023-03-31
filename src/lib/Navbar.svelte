<script>
    import { getAuth, onAuthStateChanged } from "firebase/auth";

    $: showNav = false;
    $: logoutModalActive = false;
    let userName = "";


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
        <div class="logo-container" on:click={() => {window.location.replace("/#/")}} on:keypress={() => {
            console.log("");
        }}>
            <img src="./assets/cookbook.png" alt="Cookbook icon">
            <h2>Digital Cookbook</h2>
        </div>
        <nav>
            <!-- <a href="/#/recipes">Your Recipes</a> -->
            <a href="/#/">Dashboard</a>
            <!-- <a href="/#/explore">Explore</a> -->
            <a href="/#/new-recipe" id="new-recipe">New Recipe</a>
            <button class="logout" on:click|preventDefault={() => {logoutModalActive = true}}><p>Sign out</p></button>
        </nav>
        
    </div>
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

    .logout-modal h3 {
        color: black;
        font-weight: 100;
        font-size: 30px;
    }

    .logout-wrapper {
        margin: 0 auto;
        position: relative;
        bottom: -40%;
        background-color: white;
        width: 400px;
        padding: 2em;
        border-radius: 15px;
    }

    .logo-container {
        display: flex;
        cursor: pointer;
    }
    h2 {
        max-width: 10ch;
        font-size: 18px;
        margin: 0;
        background: var(--accent-color-main);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        position: relative;
        bottom: -5px;
    }
    .navbar-outer {
        background-color: white;
        border-bottom: 1px solid #ccc;
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

    img {
        height: 90%;
    }

    nav {
        display: flex;
        flex-direction: row;
        height: 100%;
        gap: 30px;
        padding-right: 30px;
    }



    nav a {
        font-size: 15px;
        color: rgb(70, 70, 70);
        font-weight: 600;
        margin: 0;
        /* position: relative;
        bottom: -20px; */
        vertical-align: middle;
        line-height: 60px;
        transition: all 100ms ease;
        
    }

    a:hover {
        border-bottom: 5px solid black;
    }

    .logout {
        padding: 0px;
        color: rgb(70, 70, 70);
        background-color: transparent;
        border: none;
        transition: all ease 100ms;
        font-weight: 600;
        font-size: 15px;
    }

    .logout:hover {
        border: none;
        /* border-bottom: 5px solid black;
        border-radius: 0; */
    }

    p {
        margin: 0;
        line-height: 60px;
        vertical-align: middle;
        transition: all 100ms ease;
    }

    p:hover {
        border-bottom: 5px solid black;
    }

    .logout:focus-visible {
        outline: none;
    }
</style>