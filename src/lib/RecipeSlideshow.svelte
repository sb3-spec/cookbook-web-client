<script>
    import { onMount } from "svelte";
    import Swiper, { Navigation } from "swiper";
    import 'swiper/css';
    import 'swiper/css/navigation';

    import RecipeWidget from "./RecipeWidget.svelte";

    export let title = "";
    export let description = "";
    export let recipes = [];

    onMount(() => {
        const swiper = new Swiper('.swiper-container', {
            modules: [Navigation],
            slidesPerView: 4,
            // spaceBetween: 100,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    })

    

</script>



<div class="swiper swiper-container">
    <h2>{title}</h2>
    <p>{description}</p>
    
    <div class="swiper-wrapper">
        {#each recipes as recipe}
            <div class="swiper-slide">
                <RecipeWidget {recipe} />
            </div>
        {/each}
    </div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
   
</div>


<style>

    /* .swiper-wrapper {
        padding: 0 3em;
    } */

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
        border-top: 5px solid black;
        margin-bottom: 150px;
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
        font-weight: 100;
        font-size: 35px;
    }

    /* .swiper-wrapper {
        transform: translateX(40px) !important;
       
    } */
</style>
