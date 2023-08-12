<script lang="ts">
  import { CurrentRecipeStore } from "../stores/CurrentRecipe";
  import { recipeEdit } from "../stores/RecipeEdit";
  import RecipeForm from "../lib/RecipeForm.svelte";

  recipeEdit.set($CurrentRecipeStore);
</script>

<div class="recipe-edit-outer">
  <RecipeForm httpMethod="PATCH" />
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
