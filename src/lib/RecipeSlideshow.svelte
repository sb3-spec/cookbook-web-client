<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Swiper from "swiper";
  import { Navigation } from "swiper/modules";
  import "swiper/css";
  import "swiper/css/navigation";

  import RecipeWidget from "./RecipeWidget.svelte";
  import { Recipe } from "../utils/customTypes";

  export let title = "";
  export let description = "";
  export let recipes: Recipe[] = [];

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (recipes.length == 0) {
      return;
    }
    const swiper = new Swiper(".swiper-container", {
      modules: [Navigation],
      slidesPerView: 1,
      breakpoints: {
        600: {
          slidesPerView: 2,
        },
        900: {
          slidesPerView: 4,
        },
      },
      // spaceBetween: 100,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
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
  {/if}
</div>

<style>
  .swiper-wrapper {
    padding-bottom: 2em;
  }

  .swiper-button-prev {
    left: 0;
  }

  .swiper-button-next {
    right: 0;
  }
  .swiper-container {
    width: calc(var(--content-width) + 10%);
    margin: 0 auto;
    position: relative;
    border-top: 5px solid var(--main-color);
    margin-bottom: 150px;
    padding-bottom: 1em;
  }

  .swiper-wrapper {
    width: var(--content-width);
    margin: 0 auto;
    padding-right: 5%;
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
    color: black;
  }

  /* .swiper-wrapper {
        transform: translateX(40px) !important;
       
    } */

  @media (max-width: 1000px) {
    .swiper-container {
      width: auto;
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
