<script lang="ts">
    import { onDestroy } from "svelte";
    import { CurrentRecipeStore } from "../stores/CurrentRecipe";
    import RecipeForm from "../lib/RecipeForm.svelte";
    import { Recipe } from "../utils/customTypes";

    let recipe: Recipe;


    let unsubscribe = CurrentRecipeStore.subscribe(data => {
        if (data == null) {
            recipe = new Recipe();
        } else {
            recipe = data;

        }
        
    });

    onDestroy(() => {
        unsubscribe();
    })


</script>

<div class="recipe-edit-outer">
    <RecipeForm {recipe} httpMethod="PATCH"/>
</div>


<style>

    .recipe-edit-outer {
        padding: 0;
        padding-top: 5em;
        position: relative;
    }


    @media (min-width: 1400px) {
        
    }
</style>

