<script>
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { getRecipesByTag } from "../api/recipeFunctions";
    import RecipeSlideshow from "./RecipeSlideshow.svelte";

    export let tag = "";
    export let title = "";
    let recipes = [];

    let auth =  getAuth();

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

<RecipeSlideshow title={title} recipes={recipes} />