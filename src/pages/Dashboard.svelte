<script>
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { onMount } from "svelte";
    import { getRecipes } from "../api/recipeFunctions";
    import RecipesByTag from "../lib/RecipesByTag.svelte";
    import RecipeSlideshow from "../lib/RecipeSlideshow.svelte";
    let recipes = [];

    let auth = getAuth();


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
  

</script>


<div class="dashboard-outer">
    <!-- <RecentRecipes /> -->
    <RecipeSlideshow title="Your Recipes" recipes={recipes}/>
    <RecipesByTag title="What to Cook This Week" tag="Weeknight-Dinner" />

</div>

<style>
    .dashboard-outer {
        padding-top: 50px;
    }
</style>