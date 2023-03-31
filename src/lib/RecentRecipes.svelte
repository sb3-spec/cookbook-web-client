<script>
    import { getAuth, onAuthStateChanged } from "firebase/auth";

    import { api } from "../utils/RecipeApi";
    import RecipeWidget from "./RecipeWidget.svelte";


    $: recipes = [];
    $: loading = true;
    
    let auth = getAuth();
    let user = auth.currentUser;

    

    onAuthStateChanged(auth, user => {
        if (user !== null) {
            const config = {
                headers: {
                    'X-Auth-Token': user.uid
            }
    }
            console.log(user);
            api.get(`chefs/recipes`, config).then(res => {
                // we need to have 2 .datas since warp references the data to be sent as data, and so does axios
                recipes = res.data.data;
            }).catch(err => {
                alert(err.message);
            }).finally(() => {loading = false});
        }
    });

</script>

<div class="recent-recipes-outer">
    <h2>Recently Viewed</h2>
    {#if !loading}

        {#if recipes.length !== 0}
            <ul>
                {#each recipes as recipe}
                <li>
                    <RecipeWidget {recipe}/>
                </li>
                {/each}
            </ul>
        {:else}
            <span>No recent recipes found</span>
        {/if}
    {:else}
        <img src="\assets\Spinner-1s-200px.svg" alt="Loading spinner animation">
    {/if}
</div>

<style>
    .recent-recipes-outer {
        margin-top: 100px;
        width: var(--content-width);
        margin: 0 auto;
        border-top: 8px solid black;
    }
    

    h2 {
        font-weight: 400;
        font-size: 30px;
        margin: 0;
    }

    ul {
        display: flex;
        justify-content: flex-start;
        column-gap: 80px;
        padding: 0;
    }

    li {
        list-style: none;
        /* border: 1px solid black; */
        /* border-radius: 15px; */
        max-width: 200px;
        cursor: pointer;
        padding: 2px 5px;
    }
</style>