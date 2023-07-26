<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { CurrentRecipeStore } from "../stores/CurrentRecipe";
  import { frontendHost } from "../utils/hosts";
  import TagChip from "./TagChip.svelte";
  import { Recipe } from "../utils/customTypes";

  export let recipe: Recipe;

  const dispatch = createEventDispatcher();

  let optionsModal = false;

  function sendDeleteConfirm() {
    dispatch("confirmDelete", {
      text: recipe.id,
    });
  }

  function handleClick() {
    CurrentRecipeStore.set(recipe);
    sessionStorage.setItem("currentRecipe", JSON.stringify(recipe));
  }

  function handleEdit() {
    handleClick();
    window.location.href = frontendHost + "#/edit";
  }
</script>

<div
  role="listitem"
  id="recipe-widget"
  class="recipe-widget-outer"
  on:mouseover={() => {
    optionsModal = true;
  }}
  on:focus={() => {}}
  on:mouseleave={() => {
    optionsModal = false;
  }}
>
  <button on:click|stopPropagation={handleEdit} class="edit-recipe-btn">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 21 21"
    >
      <g
        fill="none"
        fill-rule="evenodd"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M10 4.5H5.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V11"
        />
        <path
          d="M17.5 3.467a1.462 1.462 0 0 1-.017 2.05L10.5 12.5l-3 1l1-3l6.987-7.046a1.409 1.409 0 0 1 1.885-.104zm-2 2.033l.953 1"
        />
      </g>
    </svg>
  </button>
  <button
    on:click|stopPropagation|preventDefault={sendDeleteConfirm}
    style="margin: 0; padding: 0; outline: none; border: none;"
    class="delete-recipe"
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
  <a href={"/#/" + recipe.title.replace(" ", "-")} on:click={handleClick}>
    <div class="img-wrapper">
      <img src={recipe.image_url} alt={recipe.title} />
    </div>
    <h3 style="font-weight: 500;">{recipe.title}</h3>
    <div class="tags">
      {#each recipe.tags as tag}
        {#if tag}
          <TagChip {tag} {recipe} isWidget={true} />
        {/if}
      {/each}
    </div>
  </a>
</div>

<style>
  .delete-recipe {
    position: absolute;
    left: 4px;
    top: 4px;
    backdrop-filter: blur(20px);
    transition: all 200ms ease;
  }

  .delete-recipe,
  .edit-recipe-btn {
    background-color: var(--button-bg);
  }

  .edit-recipe-btn {
    position: absolute;
    padding: 0;
    margin: 0;
    right: 4px;
    top: 4px;
    border: none;
    backdrop-filter: blur(20px);
    transition: all 200ms ease;
  }

  button:hover {
    transform: translateY(1px);
  }

  .tags {
    padding: 5px 10px;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    height: 4em;
  }

  .recipe-widget-outer {
    background-color: var(--recipe-widget-bg);
    border-radius: 5px;
    width: 300px;
    transition: all 200ms ease;
    position: relative;
    cursor: pointer;
    border: 1px solid var(--contrast-border);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }

  a {
    color: black;
  }

  .recipe-widget-outer:hover {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  h3 {
    margin: 0;
    font-weight: 300;
    font-size: 22px;
  }

  img {
    border-radius: 5px 5px 0 0;
    object-fit: cover;
    width: 100%;
    height: 300px;
  }

  @media (max-width: 1000px) {
    .recipe-widget-outer {
      margin: 0 auto;
    }
  }
</style>
