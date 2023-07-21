<script lang="ts">
  import { onMount, createEventDispatcher, onDestroy } from "svelte";

  import { CurrentRecipeStore } from "../stores/CurrentRecipe";
  import { Recipe } from "../utils/customTypes";

  export let tag: string;
  export let tagColor: string = "#03c04a";
  export let isWidget: boolean = false;
  export let clickable: boolean = false;
  export let canDelete = false;

  let prepDelete = false;
  export let recipe: Recipe;
  let dispatch = createEventDispatcher();

  function deleteTag() {
    recipe.tags = recipe.tags.filter((item) => item != tag);
    CurrentRecipeStore.set(recipe);
  }

  onMount(async () => {
    if (tag == null) {
      return;
    }
    console.log(recipe);
    const el: HTMLElement = document.querySelector(
      `.${tag.replace(" ", "-")}-${recipe.id}`
    );

    el.style.border = `1px solid ${tagColor}`;
    el.style.backgroundColor = tagColor + "20";

    el.style.maxHeight = "27.25px";

    if (isWidget) {
      el.style.fontSize = "12.5px";
      el.style.maxHeight = "18.25px";
    }

    if (clickable) {
      el.style.cursor = "pointer";

      el.addEventListener("click", () => {
        recipe.tags.push(tag);
        CurrentRecipeStore.set(recipe);
        sessionStorage.setItem("currentRecipe", JSON.stringify(recipe));
        dispatch("tagAdded");
      });
    }

    if (canDelete) {
      el.addEventListener("click", () => {
        prepDelete = !prepDelete;
      });
      el.style.cursor = "pointer";

      el.addEventListener("mouseover", async () => {
        // el.style.width = `${tagLength + 2.5}ch`

        prepDelete = true;
      });

      el.addEventListener("mouseleave", async () => {
        // el.style.width = `${tagLength}ch`
        prepDelete = false;
      });
    }
  });
</script>

{#if tag}
  <div class={`chip-container ${tag.replace(" ", "-")}-${recipe.id}`}>
    <p style="margin: 0;">{tag}</p>
    {#if prepDelete}
      <svg
        role="button"
        tabindex="0"
        on:click={deleteTag}
        on:keydown={deleteTag}
        id="delete-tag"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 21 21"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m15.5 15.5l-10-10zm0-10l-10 10"
        />
      </svg>
    {/if}
  </div>
{/if}

<style>
  .chip-container {
    border-radius: 15px;
    padding: 1px 5px;
    font-size: 15.5px;
    color: var(--main-color);
    overflow-x: hidden;
    transition: all 200ms ease;
    display: flex;
    overflow-y: hidden;
    text-align: center;
    position: relative;
    width: max-content;
    min-width: max-content;
    font-weight: 400;
  }

  svg {
    height: 17.5px;
    width: 17.5px;
    transform: translateY(5px) translateX(1px);
  }

  svg:active {
    outline: none;
  }
</style>
