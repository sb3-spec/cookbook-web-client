<script>
    import { createEventDispatcher } from "svelte";
    import { CurrentRecipeStore } from "../stores/CurrentRecipe";
    import { frontendHost } from "../utils/hosts";

    const dispatch = createEventDispatcher();

    let optionsModal = false;

    function sendDeleteConfirm() {
        dispatch('confirmDelete', {
            text: recipe.id
        });
    }

    export let recipe = {
        title: '',
        cook_time: '',
        tags: [],
        ingredients: [],
        header: ''
    }

    function handleClick(e) {

        localStorage.setItem('currentRecipe', JSON.stringify(recipe));
        CurrentRecipeStore.set(recipe);
    }

    async function handleDelete() {
        // TODO
    }

</script>


<div id="recipe-widget" class="recipe-widget-outer" on:mouseover={() => {optionsModal = true}} on:focus={() => {}} on:mouseleave={() => {optionsModal = false}}>
    <a href={"/#/" + recipe.title.replace(' ', '-')} on:click={handleClick}>
        <div class="img-wrapper"><img src={recipe.image_url} alt={recipe.title}></div>
        <h3>{recipe.title}</h3>
        <p>{recipe.cook_time}</p>
    </a>
    {#if optionsModal}
        <div class="recipe-widget-menu">
            <button on:click|preventDefault={sendDeleteConfirm}>Delete</button>
            <button>Edit</button>
        </div>
    {/if}
</div>




<style>
    
    
    

    .recipe-widget-menu {
        position: absolute;
        top: -2em;
        right: -2em;
        background-color: white;
        backdrop-filter: blur(40px);
        z-index: 5;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        border-radius: 10px;
        padding: 5px 5px;
        color: black;
        width: 60px;
        font-size: 16px;
    }

    .recipe-widget-menu button {
        border: none;
        padding: 5px;
        background-color: inherit;
        width: 100%;
    }

    .recipe-widget-menu button:hover {
        background-color: rgba(211 211 211 / .3);
        border-radius: 5px;
    }

    .recipe-widget-outer {
        background-color: var(--primary-button);
        border-radius: 5px;
        height: 278px;
        width: 235px;
        transition: all 400ms ease;
        position: relative;
        cursor: pointer;        
    }

    a {
        color: black;
    }

    .recipe-widget-outer:hover {
        box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
    }

    h3 {
        margin: 0;
        font-weight: 300;
        font-size: 25px;
    }

    .img-wrapper {
        height: 60%;
    }

    img {
        object-fit: cover;
        height: 100%;
        width: 100%;
        border-radius: 5px 5px 0 0;
    }

    p {
        position: absolute;
        bottom: 10px;
        margin: 0 auto;
        left: 10px;
    }

    

    @media (max-width: 900px) {
        .recipe-widget-outer {
            margin: 0 auto;
            width: 65%;
            height: 350px;
        }
    }
</style>