<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Swiper } from "swiper";
  import { Navigation, Pagination } from "swiper/modules";
  import "swiper/css";
  import "swiper/css/navigation";
  import "swiper/css/pagination";

  import RecipeWidget from "./RecipeWidget.svelte";
  import { YourRecipesStore } from "../stores/RecipeListStore";

  export let title = "";
  export let description = "";
  $: recipes = $YourRecipesStore;

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (recipes.length == 0) {
      return;
    }
    const swiper = new Swiper(".swiper-container", {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      breakpoints: {
        600: {
          slidesPerView: 2,
        },
        900: {
          slidesPerView: 5,
        },
      },
      // spaceBetween: 100,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
      },
    });
  });
</script>

<div class="swiper swiper-container">
  <h2 style="color: var(--text-color);">{title}</h2>
  <p>{description}</p>

  {#if recipes.length === 0}
    You have no Recipes saved currently. To add a Recipe, head over to <a
      href="#/new-recipe">New Recipe</a
    >
  {:else}
    <div class="swiper-wrapper">
      {#each recipes as recipe}
        <div class="swiper-slide">
          <RecipeWidget
            {recipe}
            on:confirmDelete={(e) => {
              dispatch("confirmDelete", { text: e.detail.text });
            }}
          />
        </div>
      {/each}
    </div>
    <div class="swiper-button-prev btn" />
    <div class="swiper-button-next btn" />
    <div class="swiper-pagination" />
  {/if}
</div>

<style>
  .swiper-button-prev {
    right: 0;
  }

  .swiper-button-next {
    right: 0;
  }
  .swiper-container {
    position: relative;
    border-top: 5px solid var(--main-color);
    padding-bottom: 0em;
    width: calc(var(--content-width) + 20%);
  }

  .swiper-wrapper {
    width: calc(var(--content-width));
    padding-right: 5%;
    padding-bottom: 2em;
    display: flex;
    gap: 0em;
  }

  .swiper-slide {
    width: max-content;
  }

  h2 {
    font-weight: 300;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    font-size: 45px;
    color: black;
  }

  .btn {
    color: var(--text-color);
    position: absolute;
    top: 5em;
  }

  /* .swiper-wrapper {
        transform: translateX(40px) !important;
       
    } */

  @media (max-width: 1000px) {
    .swiper-container,
    .swiper-wrapper {
      width: auto;
    }

    .swiper-wrapper {
      margin: 0;
      justify-content: space-between;
    }

    .swiper-container {
      margin: 0 !important;
    }

    h2 {
      font-size: 30px;
    }

    .swiper-button-next {
      right: 10px;
    }

    .swiper-button-prev {
      left: 10px;
    }

    .btn {
      display: none;
    }
  }
</style>
