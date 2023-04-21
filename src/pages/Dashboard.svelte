<script>
    import { getAuth, onAuthStateChanged, reload } from "firebase/auth";
    import { createEventDispatcher, onMount } from "svelte";
    import { getRecipes } from "../api/recipeFunctions";
    import RecipesByTag from "../lib/RecipesByTag.svelte";
    import RecipeSlideshow from "../lib/RecipeSlideshow.svelte";
    import { api } from "../api";
    let recipes = [];

    let auth = getAuth();
    let confirmDelete = false;

    let targetDeleteId;


    onAuthStateChanged(auth, user => {
        if (user !== null) {
            getRecipes().then(res => {
                recipes = res;
                console.log(recipes);
            }).catch(err => {
                console.log(err);
            });
            

        } else {
            recipes = [];
        }
    })

    const dispatch = createEventDispatcher();

    function forward(event) {
        confirmDelete = true;
        targetDeleteId = event.detail.text;
    }


    async function handleDelete() {
        let config = {
            headers: {
                'X-Auth-Token': getAuth().currentUser.uid
            }
        }
        if (targetDeleteId) {
            api.delete('recipes/' + targetDeleteId, config).then(res => {
                if (res.status === 200) {
                    confirmDelete = false;
                    window.location.reload();
                }
            }).catch(err => {
                alert("Error deleting recipe");
                console.log(err.message);
            })
        }
    }
  

</script>


<div class="dashboard-outer">
    <!-- <RecentRecipes /> -->
    <RecipeSlideshow title="Your Recipes" recipes={recipes} on:confirmDelete={forward}/>
    <RecipesByTag title="What to Cook This Week" tag="Weeknight-Dinner" />

</div>

{#if confirmDelete}
    <div class="confirm-delete-wrapper">
        <div class="confirm-delete">
            <h3>Delete this recipe?</h3>
            <button on:click={handleDelete}>Yes</button>
            <button on:click|preventDefault={() => {
                confirmDelete = false;
            }}>No</button>
        </div>
    </div>
{/if}



<style>
    .dashboard-outer {
        padding-top: 50px;
    }

    .confirm-delete-wrapper {
        position: fixed;
        margin: 0 auto;
        z-index: 15;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0 0 0 / .8);
        z-index: 10;
        backdrop-filter: blur(2.5px);
        padding-top: 10em;
    }

    .confirm-delete {
        width: 100%;

    }

    .confirm-delete-wrapper h3 {
        color: white;
        font-weight: 100;
        font-size: 30px;
    }
</style>