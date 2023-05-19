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
            <div class="title-wrapper">
                <h1>{recipe.title}</h1>
            </div>
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
                    <p>{ingredient}</p>
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

    .title-wrapper {
        height: 500px;
        width: 640px;
        border-bottom: 5px solid var(--accent);
    }


    /* .title-wrapper::after {
        content: "";
        background-color: black;
        height: 1px;
        width: 90%;
        position: relative;
        bottom: -100%;
        margin-left: auto;
        display: block;
    } */

    .recipe-description-wrapper {
        width: 700px;
        text-align: left;
        position: relative;
        height: 200px;
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
        color: white;
    }

    h1 {
        width: 100%;
        text-align: center;
        font-weight: 100;
        /* line-height: 500px; */
        vertical-align: middle;
        margin-top: 3em;
    }

    /* h1::after {
        content: "";
        background-color: black;
        height: 1px;
        width: 90%;
        position: relative;
        margin-left: auto;
        display: block;
    } */


    img {
        object-fit: cover;
        border-radius: 15px;
        width: 500px;
        height: 500px;
    }

    .recipe-info-wrapper {
        display: flex;
        justify-content: space-between;
        height: max-content;
        padding-bottom: 40px;
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
        border-top: 5px solid var(--accent);
        width: 500px;
        text-align: left; 
    }

    .steps {
        width: calc(700px - 5%);
        text-align: left;
        border-top: 5px solid var(--accent);
    }

    h2 {
        margin: 0;
        margin-bottom: 40px;
    }

    .ingredients p {
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

    @media (max-width: 900px) {

        .recipe-description-wrapper {
            width: 100%;
            position: relative;
            padding-bottom: 30px;
        }

        .recipe-description-wrapper p {
            color: white;
            max-width: 45ch;
            left: 20px;
        }
        
        .recipe-outer {
            width: 100%;
        }
        .recipe-header-wrapper {
            flex-direction: column;
            width: 100%;
            height: 350px;
        }

        .recipe-header-wrapper img {
            width: 100%;
            border-radius: 0;
        }

        .title-wrapper {
            border-bottom: 5px solid var(--accent);
            position: relative;
            height: 30px;
        }

        .title-wrapper h1 {
            font-size: 30px;
            font-weight: 400;
            text-align: left;
            margin: 0;
            position: absolute;
            left: 20px;
            top: 20px;

        }

        .title-wrapper {
            height: 500px;
            width: 640px;
            border-bottom: none;
        }

        .recipe-info-wrapper {
            flex-direction: column;
        }

        .info-item {
            margin-left: 20px;
        }

        .instructions {
            flex-direction: column;
        }

        .instructions h2, .instructions h4 {
            font-size: 20px;
            margin-left: 20px;
            margin-bottom: 0;
        }


        .instructions p {
            font-size: 15px;
            margin-left: 20px;
        }

        .ingredients, .steps {
            padding: 20px 0 10px 0;
            border-top: 1px solid var(--accent);
        }

        .steps h4 {
            margin-top: 20px;
        }

        .steps p {
            max-width: 45ch;
        }

        .steps {
            margin-bottom: 80px;
        }

    }
</style>