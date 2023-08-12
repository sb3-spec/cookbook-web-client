<script lang="ts">
  import { api } from "../utils/RecipeApi";
  import RecipeForm from "../lib/RecipeForm.svelte";
  import { Recipe } from "../utils/customTypes";
  import { recipeEdit } from "../stores/RecipeEdit";

  let scrapeUrl = "";
  let scrapeModal = true;

  async function tryScrapeRecipe() {
    api
      .get("/recipes/scrape/" + encodeURIComponent(scrapeUrl))
      .then((res) => {
        // Fill out form from scraped data
        recipeEdit.set(new Recipe(res.data.data));
        scrapeUrl = "";
      })
      .catch((err) => {
        console.log(err);
      });
  }
</script>

<div class="recipe-edit-outer">
  {#if scrapeModal}
    <div class="scrape-modal" style="padding-bottom: 2em;">
      <h3>Import recipe from online?</h3>
      <input type="text" bind:value={scrapeUrl} />
      <button
        type="button"
        on:click|preventDefault={tryScrapeRecipe}
        disabled={!scrapeUrl || !scrapeUrl.startsWith("https")}>Import</button
      >
    </div>
  {/if}
  <RecipeForm />
</div>

<style>
  .scrape-modal {
    width: 300px;
    margin: 0 auto;
    position: relative;
  }

  .scrape-modal input {
    width: 100%;
    color: var(--text-color);
  }

  .scrape-modal button {
    background-color: white;
    color: black;
    position: relative;
    width: 100%;
    left: 0;
    right: 0;
    border: 1px solid black;
  }

  .scrape-modal button:disabled {
    color: grey;
    border-color: grey;
  }

  .recipe-edit-outer {
    padding: 4em 0;
    position: relative;
  }

  button {
    border: none;
    font-weight: 400;
    font-size: 16px;
    position: absolute;
    right: 0;
    padding: 0.3em 0.5em;
    top: 5px;
    right: 20%;
    border: 1px solid var(--main-color);
  }

  button:disabled {
    color: gray;
    background-color: white;
  }

  button:disabled:hover {
    color: gray;
  }
  input {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--main-color);
    color: black;
    font-size: 16px;
    font-weight: 100;
    width: 100%;
  }

  input {
    margin-bottom: 15px;
  }

  input::-webkit-input-placeholder {
    font-weight: 100;
    color: black;
    opacity: 0.7;
  }

  input::-ms-input-placeholder {
    font-weight: 100;
    color: black;
  }

  input:focus,
  input:focus-visible,
  input:focus {
    outline: none;
  }

  @media (max-width: 1000px) {
    .recipe-edit-outer {
      padding-bottom: 0;
    }
  }
</style>
