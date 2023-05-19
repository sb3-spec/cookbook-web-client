<script>
    import { createEventDispatcher, onMount } from "svelte";
    import Swiper, { Navigation } from "swiper";
    import 'swiper/css';
    import 'swiper/css/navigation';

    import RecipeWidget from "./RecipeWidget.svelte";

    export let title = "";
    export let description = "";
    export let recipes = [];

    const dispatch = createEventDispatcher();

    onMount(() => {
        const swiper = new Swiper('.swiper-container', {
            modules: [Navigation],
            slidesPerView: 1,
            breakpoints: {
                600: {
                    slidesPerView: 2
                },
                900: {
                    slidesPerView: 4
                },

            },
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
                <RecipeWidget {recipe} on:confirmDelete={(e) => {dispatch("confirmDelete", {text: e.detail.text})}}/>
            </div>
        {/each}
    </div>
    <div class="swiper-button-prev btn"></div>
    <div class="swiper-button-next btn"></div>
   
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
        border-top: 5px solid var(--accent);
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
        font-weight: 600;
        font-size: 45px;
        color: var(--text)
    }

    .btn {
        color: var(--primary-button);
    }

    /* .swiper-wrapper {
        transform: translateX(40px) !important;
       
    } */

    @media (max-width: 900px) {
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
    }
</style>
