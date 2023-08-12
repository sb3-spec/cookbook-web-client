<script lang="ts">
  import { YourRecipesStore } from "../stores/RecipeListStore";
  import { deleteRecipe, getRecipes } from "../api/recipe";
  import RecipeSlideshow from "../lib/RecipeSlideshow.svelte";
  import Loading from "../lib/Loading.svelte";
  import { Recipe } from "../utils/customTypes";

  import { getAuth, onAuthStateChanged } from "firebase/auth";

  let confirmDelete = false;

  let targetDeleteId;
  let loading = true;

  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      let result = await getRecipes();

      console.log(result.recipes);
      if (result.status === 200) {
        const recipeObjs = result.recipes.map((data) => new Recipe(data));
        YourRecipesStore.set(recipeObjs);
      } else {
        console.log(result.status, result.message);
      }
    }
    loading = false;
  });

  function forward(event) {
    confirmDelete = true;
    targetDeleteId = event.detail.text;
  }

  async function handleDelete() {
    let result = await deleteRecipe(Number(targetDeleteId));

    if (result.status === 200) {
      YourRecipesStore.update((prevVal) =>
        prevVal.filter((recipe) => {
          recipe.id !== result.recipe.id;
        })
      );
    }
    confirmDelete = false;
  }
</script>

<div class="dashboard-outer">
  {#if loading}
    <Loading />
  {:else}
    <RecipeSlideshow title="Your Recipes" on:confirmDelete={forward} />
  {/if}
</div>

{#if confirmDelete}
  <div class="confirm-delete-wrapper">
    <div class="confirm-delete">
      <h3>Delete this recipe?</h3>
      <button on:click={handleDelete}>Yes</button>
      <button
        on:click|preventDefault={() => {
          confirmDelete = false;
        }}>No</button
      >
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
    background-color: rgba(0 0 0 / 0.8);
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
