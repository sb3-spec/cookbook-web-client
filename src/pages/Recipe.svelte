<script>
    import { onDestroy, onMount } from "svelte";
    import { CurrentRecipeStore } from "../stores/CurrentRecipe";
    import { frontendHost } from "../utils/hosts";

    let recipe;

    onMount(() => {
        const unsubscribe = CurrentRecipeStore.subscribe(data => {
            if (Object.keys(data).length === 0) {
                recipe = JSON.parse(localStorage.getItem('currentRecipe'));
                
            } else {
                recipe = data;
            }
           
        });
    });

    
</script>

{#if recipe !== null && recipe !== undefined}
    <div class="recipe-outer">
        <div class="recipe-header-wrapper">
            <img src={recipe.image_url} alt={recipe.title}>
            <h1>{recipe.title}</h1>
        </div>
        <div class="recipe-info-wrapper">
            <div class="recipe-content-wrapper">
                <div class="info-wrapper">
                    <div class="info-item">
                        <p><span>Time</span>{recipe.cook_time}</p>
                    </div>
                    <div class="info-item">
                        <p>
                            <span>Tags</span>
                            {#each recipe.tags as tag}
                                {tag}
                            {/each}
                        </p>
                    </div>
                </div>
            </div>
            <div class="recipe-description-wrapper">
                <p>{recipe.header}</p>
            </div>
        </div>
        <div class="instructions">
            <div class="ingredients">
                <h2>Ingredients</h2>
                {#each recipe.ingredients as ingredient}
                    <h4>{ingredient}</h4>
                {/each}
            </div>
            <div class="steps">
                <h2>Preparation</h2>
                {#each [...recipe.steps.entries()] as [idx, step]}
                    <h4>Step {idx + 1}</h4>
                    <p>{step}</p>
                {/each}
            </div>
        </div>

    </div>
{:else}
    <h2>Recipe Not Found</h2>
{/if}

<style>
    .recipe-header-wrapper {
        display: flex;
        margin-bottom: 2em;
        height: 500px;
        justify-content: space-between;
    }

    .recipe-description-wrapper {
        width: 700px;
        text-align: left;
        position: relative;
    }

    .recipe-description-wrapper p {
        position: absolute;
        left: 10%;

    }

    .info-wrapper {
        width: 500px;
    }

    .recipe-outer {
        width: var(--content-width);
        padding-top: 3em;
        margin: 0 auto;
    }

    h1 {
        width: 700px;
        text-align: center;
        font-weight: 100;
        line-height: 500px;
        vertical-align: middle;
        margin: 0;
    }

    h1::after {
        content: "";
        background-color: black;
        height: 1px;
        width: 90%;
        position: relative;
        margin-left: auto;
        display: block;
    }


    img {
        object-fit: cover;
        border-radius: 15px;
        width: 500px;
        height: 500px;
    }

    .recipe-info-wrapper {
        display: flex;
        justify-content: space-between;
        height: 300px;
    }

    .info-item {
        display: flex;
        justify-content: space-between;
        width: max-content;
    }

    span {
        font-weight: bold;
        margin-right: 1em;
        font-size: large;
    }

    .instructions {
        display: flex;
        justify-content: space-between;
        
    }

    .ingredients {
        border-top: 5px solid black;
        width: 500px;
        text-align: left; 
    }

    .steps {
        width: calc(700px - 5%);
        text-align: left;
        border-top: 5px solid black;
    }

    h2 {
        margin: 0;
        margin-bottom: 40px;
    }

    .ingredients h4 {
        font-weight: 400;
        font-size: 20px; 
        position: relative;
        
    }

    .steps h4 {
        font-size: 20px;
        margin-bottom: 5px;
    }

    .steps p {
        font-size: 20px;
    }
</style>