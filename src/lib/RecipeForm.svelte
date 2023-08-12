<script lang="ts">
  import { recipeEdit } from "../stores/RecipeEdit";
  import AddTagMenu from "../lib/AddTagMenu.svelte";
  import { Recipe } from "../utils/customTypes";
  import { createRecipe, patchRecipe } from "../api/recipe";

  $: recipe = $recipeEdit;
  export let httpMethod: String = "POST";

  $: submitDisabled = Boolean(
    recipe.title === "" ||
      recipe.header === "" ||
      recipe.ingredients[0] === "" ||
      recipe.steps[0] === ""
  );

  function newItem(type: string) {
    if (type == "ingr") {
      recipe.ingredients.length++;
      recipe.ingredients[recipe.ingredients.length - 1] = "";
    } else if (type == "step") {
      recipe.steps.length++;
      recipe.steps[recipe.steps.length - 1] = "";
    } else {
      return;
    }
  }

  function deleteItem(idx: number, type: string) {
    if (type == "ingr") {
      recipe.ingredients = recipe.ingredients.filter(
        (_, index) => index !== idx
      );
    } else if (type == "step") {
      recipe.steps = recipe.steps.filter((_, index) => index !== idx);
    } else {
      return;
    }
  }

  async function handleSubmit() {
    let result: Object;
    if (httpMethod == "POST") {
      result = await createRecipe(recipe);
    } else {
      result = await patchRecipe(recipe);
    }
  }

  function handleFormChange() {
    recipeEdit.set(recipe);
  }
</script>

<div class="recipe-form-outer">
  <form on:change={handleFormChange} on:submit|preventDefault={handleSubmit}>
    <div class="edit-recipe-header">
      <div
        style="display: flex; flex-direction: column;"
        class="title-and-description"
      >
        <span style="display: flex; flex-direction: column">
          <label for="title">Title</label>
          <input
            style="font-weight: bold;"
            type="text"
            name="title"
            bind:value={recipe.title}
            autocomplete="off"
          />
        </span>
        <span style="display: flex; flex-direction: column">
          <label for="description">Description</label>
          <textarea
            name="description"
            id="description"
            rows="6"
            bind:value={recipe.header}
          />
        </span>
        <span style="display: flex; gap: 20px" class="time-container">
          <span class="time left">
            <label for="prep-time">Prep</label>
            <input
              type="text"
              name="prep-time"
              bind:value={recipe.prep_time}
              autocomplete="off"
            />
          </span>
          <span class="time">
            <label for="cook-time">Cook</label>
            <input
              type="text"
              name="cook-time"
              bind:value={recipe.cook_time}
              autocomplete="off"
            />
          </span>
          <span class="time right">
            <label for="total-time">Total</label>
            <input
              type="text"
              name="total-time"
              bind:value={recipe.total_time}
              autocomplete="off"
            />
          </span>
        </span>

        <div class="tags" style="margin-top: 5px;">
          <label for="tags">Tags</label>
          <AddTagMenu canDelete={true} {recipe} />
        </div>
      </div>
      <div class="tags-and-image">
        <div class="recipe-image">
          <label for="image_url">Recipe Image</label>
          <input
            type="file"
            name="image_url"
            class="file-input"
            bind:value={recipe.image_url}
          />
          {#if recipe.image_url && recipe.image_url.startsWith("https://")}
            <img src={recipe.image_url} alt={recipe.title} />
          {/if}
        </div>
      </div>
    </div>

    <div class="instructions">
      <div class="steps-container" style="padding-top: 1em;">
        <div
          style="display: flex; position: relative; justify-content: space-between;"
        >
          <h4 style="margin: 0;">Steps</h4>
          <button
            class="add-item"
            on:click|preventDefault={(e) => {
              newItem("step");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 21 21"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 19c4.438 0 8-3.526 8-7.964C18 6.598 14.438 3 10 3c-4.438 0-8 3.598-8 8.036S5.562 19 10 19zm-4-8h8m-4 4.056V7z"
              />
            </svg>
          </button>
        </div>
        <ol class="steps-list">
          {#each recipe.steps as _, idx}
            <li style="position: relative;">
              {#if idx !== 0}
                <button
                  id="item-delete"
                  on:click|preventDefault={() => {
                    deleteItem(idx, "step");
                  }}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 21 21"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5.5 4.5h10v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2zm5-2a2 2 0 0 1 1.995 1.85l.005.15h-4a2 2 0 0 1 2-2zm-7 2h14m-9 3v8m4-8v8"
                    />
                  </svg>
                </button>
              {/if}
              <textarea
                name={`step-${idx}`}
                id={`step-${idx}`}
                rows="4"
                bind:value={recipe.steps[idx]}
              />
            </li>
          {/each}
        </ol>
      </div>
      <div class="ingredients-container">
        <div
          style="display: flex; position: relative; justify-content: space-between;padding-top: 1em;"
        >
          <h4 style="margin: 0;">Ingredients</h4>
          <button
            class="add-item"
            on:click|preventDefault={(e) => {
              newItem("ingr");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 21 21"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 19c4.438 0 8-3.526 8-7.964C18 6.598 14.438 3 10 3c-4.438 0-8 3.598-8 8.036S5.562 19 10 19zm-4-8h8m-4 4.056V7z"
              />
            </svg>
          </button>
        </div>
        <ul>
          {#each recipe.ingredients as _, idx}
            <li style="position: relative;">
              {#if idx !== 0}
                <button
                  id="item-delete"
                  on:click|preventDefault={() => {
                    deleteItem(idx, "ingr");
                  }}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 21 21"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5.5 4.5h10v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2zm5-2a2 2 0 0 1 1.995 1.85l.005.15h-4a2 2 0 0 1 2-2zm-7 2h14m-9 3v8m4-8v8"
                    />
                  </svg>
                </button>
              {/if}
              <textarea
                name={`ingr-${idx}`}
                id={`ingr-${idx}`}
                rows="1"
                bind:value={recipe.ingredients[idx]}
              />
            </li>
          {/each}
        </ul>
      </div>
    </div>
    <button type="submit" class="submit" disabled={submitDisabled}
      >Save Recipe</button
    >
  </form>
</div>

<style>
  .steps-container,
  .ingredients-container {
    width: 80%;
  }

  .time-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .title-and-description {
    gap: 20px;
  }

  .time {
    display: grid;
    grid-template-rows: 1fr 1fr;
    /* box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px; */
    border-radius: 3px;
    padding: 0 5px;
    position: relative;
  }

  .time input {
    bottom: 3px;
    font-size: 16px;
    margin-bottom: 0;
    padding: 0;
    height: 16px;
    font-family: sans-serif;
    width: 50%;
  }

  #item-delete {
    border: none;
    position: absolute;
    background-color: transparent;
    right: -5%;
    transition: all 200ms ease;
  }

  #item-delete:hover {
    transform: translateY(-55%);
  }

  .recipe-form-outer {
    padding: 10px 0;
    position: relative;
    width: 100%;
  }

  .tags {
    display: flex;
    flex-direction: column;
    width: 80%;
  }

  #description {
    margin-bottom: 20px;
  }

  .add-item {
    padding: 0;
    border: none;
    background-color: transparent;
  }

  .instructions {
    display: flex;
    flex-direction: column;
  }
  form {
    box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
    display: flex;
    flex-direction: column;
    max-width: 80%;
    margin: 0 auto;
    margin-top: 20px;
    text-align: left;
    border: none;
    padding: 2em 3em 3em 3em;
    min-height: 400px;
    position: relative;
    background-color: var(--form-bg);
  }

  textarea {
    width: 40%;
    margin: 0;
    box-sizing: border-box;
  }

  ul {
    list-style: none;
  }

  ol,
  ul {
    margin: 0;
    padding: 0;
  }

  ol li::marker {
    font-size: 20px;
  }

  button {
    border: none;
    font-weight: 400;
    font-size: 16px;
    padding: 0.3em 0.5em;
    border: 1px solid var(--main-color);
  }

  button:disabled {
    color: gray;
    background-color: white;
  }

  button:disabled:hover {
    color: gray;
  }

  textarea {
    border: none;
    font-size: 16px;
    width: 100%;
    background-color: var(--textarea-bg);
    border: none;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  }

  input {
    background-color: transparent;
    border: none;
    border-bottom: 2px solid var(--main-color);
    font-size: 16px;
    font-weight: 100;
    width: 100%;
  }

  input {
    margin-bottom: 15px;
  }

  label {
    font-weight: 400;
    font-size: 23px;
    margin-bottom: 5px;
    position: relative;
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
  input:focus,
  textarea:focus-visible {
    outline: none;
  }

  .file-input {
    border: none;
  }

  .submit {
    bottom: 0;
    /* max-height: 30px; */
    position: relative;
    font-size: 20px;
    color: white;
    width: 100%;
    right: 0;
    background-color: var(--main-color);
    transition: all 200ms;
  }

  .submit:hover {
    backdrop-filter: brightness(50%);
  }

  .submit:disabled:hover {
    background-color: white;
  }

  h4 {
    font-weight: 400;
    font-size: 23px;
    position: relative;
  }

  .recipe-image {
    display: flex;
    flex-direction: column;
  }

  .tags-and-image {
    display: flex;
    flex-direction: column;
  }

  img {
    object-fit: contain;
    max-height: 450px;
  }

  .left::before {
    content: "";
    display: flex;
    width: 1px;
    position: absolute;
  }

  #item-delete {
    top: 50%;
    transform: translateY(-50%);
  }

  @media (max-width: 1000px) {
    .submit {
      margin-top: 1em;
    }
    .steps-container,
    .ingredients-container {
      width: 100%;
    }

    .tags {
      width: 100%;
    }

    form {
      width: 100%;
      border-radius: 0%;
      border: none;
      padding: 0 1.5em;
      padding-bottom: 1em;
      margin: 0;
      box-shadow: none;
      margin: 0 auto;
    }

    .time {
      display: flex;
      flex-direction: column;
      row-gap: 10px;
      width: 100%;
      position: relative;
    }

    .time input {
      width: 90%;
    }

    .time-container label {
      font-size: 20px;
    }

    .recipe-form-outer {
      padding-bottom: 1em;
    }

    #item-delete {
      right: -10%;
    }
  }

  @media (min-width: 1001px) {
    .submit {
      width: 30%;
      margin: 0 auto;
      margin-top: 40px;
    }

    #description {
      width: 80%;
    }

    .instructions {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .recipe-image img {
      object-fit: cover;
      width: 80%;
    }

    input {
      width: 40%;
    }

    .edit-recipe-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
