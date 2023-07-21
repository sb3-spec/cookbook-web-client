<script lang="ts">
  import TagChip from "./TagChip.svelte";
  import { Recipe } from "../utils/customTypes";

  export let canDelete = false;

  let tags = ["Weeknight Dinner", "Dessert", "Vegan", "Vegetarian", "GF"];
  export let recipe: Recipe = new Recipe();

  let tagModalOpen = false;
  $: availableTags = tags.filter((tag) => !recipe?.tags?.includes(tag));

  document.addEventListener("click", (e) => {
    if (document.getElementById("tags") !== e.target) {
      tagModalOpen = false;
    }
  });
</script>

<div class="add-tag-outer">
  <div class="recipe-tags">
    {#each recipe.tags as tag}
      <TagChip {tag} {recipe} {canDelete} />
    {/each}
    <button
      type="button"
      id="add-tags"
      on:click|stopPropagation={() => {
        tagModalOpen = true;
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27.25"
        height="27.25"
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
  {#if tagModalOpen}
    <div class="tags" id="tags">
      {#each availableTags as tag}
        <TagChip
          {tag}
          {recipe}
          clickable={true}
          canDelete={false}
          on:tagAdded={() => {
            tagModalOpen = false;
          }}
        />
      {/each}
      <!-- <button type="button">
        <svg
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
            d="M10 19c4.438 0 8-3.526 8-7.964C18 6.598 14.438 3 10 3c-4.438 0-8 3.598-8 8.036S5.562 19 10 19zm-4-8h8m-4 4.056V7z"
          />
        </svg>
      </button> -->
    </div>
  {/if}
</div>

<style>
  .recipe-tags {
    display: flex;
    flex-wrap: wrap;
    row-gap: 5px;
    column-gap: 5px;
  }

  .add-tag-outer {
    display: flex;
    gap: 10px;
    padding-bottom: 30px;
    position: relative;
    width: 100%;
  }

  button {
    border: none;
    border-radius: 50%;
    margin: 0;
    padding: 0;
    font-size: 15.5px;
    background-color: transparent;
    transition: all 200ms ease;
    font-weight: bold;
    height: 27.25px;
    width: 27.25px;
  }

  .tags {
    border: 1px solid var(--main-color);
    border-radius: 3px;
    display: flex;
    flex: 1;
    position: absolute;
    background-color: var(--background);
    justify-content: center;
    column-gap: 10px;
    row-gap: 11px;
    flex-wrap: wrap;
    top: 0%;
    width: 100%;
    padding: 2em 2em;
    z-index: 10;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    backdrop-filter: blur(5px);
    box-sizing: border-box;
  }

  @media (max-width: 1000px) {
    .tags {
      width: 100%;
    }
  }
</style>
