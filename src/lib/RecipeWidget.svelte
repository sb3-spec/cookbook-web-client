<script>
    import { CurrentRecipeStore } from "../stores/CurrentRecipe";
    import { frontendHost } from "../utils/hosts";


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

</script>

<a href={"/#/" + recipe.title.replace(' ', '-')} on:click={handleClick}>
    <div id="recipe-widget" class="recipe-widget-outer">
        <div class="img-wrapper"><img src={recipe.image_url} alt={recipe.title}></div>
        <h3>{recipe.title}</h3>
        <p>{recipe.cook_time}</p>
    </div>
</a>

<style>
    .recipe-widget-outer {
        background: var(--accent-color-main);
        height: 278px;
        width: 235px;
        transition: all 200ms ease;
        position: relative;
        cursor: pointer;
        color: white;
    }

    .recipe-widget-outer:hover {
        box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
    }

    h3 {
        margin: 0;
        font-weight: 100;
        font-size: 25px;
    }

    .img-wrapper {
        height: 60%;
    }

    img {
        object-fit: cover;
        height: 100%;
        width: 100%;
    }

    p {
        position: absolute;
        bottom: 10px;
        margin: 0 auto;
        left: 10px;
    }
</style>