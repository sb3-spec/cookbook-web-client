<script>
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { getRecipesByTag } from "../api/recipe
    import RecipeSlideshow from "./RecipeSlideshow.svelte";
    import { createEventDispatcher } from "svelte";

    export let tag = "";
    export let title = "";
    let recipes = [];

    let auth =  getAuth();

    const dispatch = createEventDispatcher();

    function forward(event) {
        dispatch('confirmDelete', {
            text: event.detail.text
        });
    }

    onAuthStateChanged(auth, user => {
        if (user !== null) {
            getRecipesByTag(tag).then(res => {
                recipes = res;
            }).catch(err => {
                console.log("Error: " + err.message);
            })

        }
    });

</script>

<RecipeSlideshow title={title} recipes={recipes} on:confirmDelete={forward}/>