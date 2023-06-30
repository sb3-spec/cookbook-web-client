<script>
    import { onMount } from "svelte";
    import { CurrentRecipeStore } from "../stores/CurrentRecipe";
    import { frontendHost } from "../utils/hosts";
    import { api } from "../utils/RecipeApi";
    import { getAuth } from "firebase/auth";
    
    
    let recipe;
    let confirmDelete = false;

    onMount(() => {
        const unsubscribe = CurrentRecipeStore.subscribe(data => {
            if (Object.keys(data).length === 0) {
                recipe = JSON.parse(localStorage.getItem('currentRecipe'));
                
            } else {
                recipe = data;
            }
           
        });
    });

    function handleEdit() {
        window.location.href = frontendHost + `#/edit`;
    }

    async function handleDelete() {
        let config = {
            headers: {
                'X-Auth-Token': getAuth().currentUser.uid
            }
        }
        api.delete('recipes/' + recipe.id, config)
        .then(res => {
            if (res.status === 200) {
                confirmDelete = false;
                window.location.replace(frontendHost + `#/`);
            }
        }).catch(err => {
            console.log(err);
            alert("Error deleting recipe");
        });
    }

    

    
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
        <button class="edit" on:click={handleEdit}>Edit Recipe</button>
        <button class="delete" on:click={() => {confirmDelete = true}}>Delete</button>
    </div>
{:else}
    <h2>Recipe Not Found</h2>
{/if}

{#if confirmDelete}
    <div class="confirm-delete-wrapper">
        <div class="confirm-delete">
            <h3>Delete this recipe?</h3>
            <button on:click={handleDelete}>Yes</button>
            <button on:click|preventDefault={() => {
                confirmDelete = false;
            }}>No</button>
        </div>
    </div>
{/if}

<style>

    .confirm-delete-wrapper {
        position: fixed;
        margin: 0 auto;
        z-index: 15;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0 0 0 / .8);
        z-index: 10;
        backdrop-filter: blur(2.5px);
        padding-top: 10em;
    }

    .confirm-delete {
        width: 100%;

    }

    .confirm-delete-wrapper h3 {
        color: white;
        font-weight: 100;
        font-size: 30px;
    }

    .edit, .delete {
        margin: 5px auto;
        width: 400px;
    }

    .delete {
        color: red;
    }

    .delete:hover {
        color: white;
        background-color: red;
        border: 2px solid black;
        transition: all 200ms ease;
    }
    .recipe-header-wrapper {
        display: flex;
        margin-bottom: 2em;
        height: 500px;
        justify-content: space-between;
    }

    .title-wrapper {
        height: 500px;
        width: 640px;
        border-bottom: 5px solid var(--main-color);
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
        font-size: 19px;
    }

    .info-wrapper {
        width: 500px;
    }

    .recipe-outer {
        width: var(--content-width);
        padding-top: 3em;
        margin: 0 auto;
        color: black;
        padding-bottom: 30px;
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
        border-top: 5px solid var(--main-color);
        width: 500px;
        text-align: left; 
    }

    .steps {
        width: calc(700px - 5%);
        text-align: left;
        border-top: 5px solid var(--main-color);
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
            padding-bottom: 10px;
            height: auto;
            display: flex;
            flex: 1;
        }

        .recipe-description-wrapper p {
            width: 90%;
            left: 20px;
            height: auto;
            position: relative;
        }

        .title-wrapper {
            width: 100%;
        }
        
        .recipe-outer {
            width: 100%;
            padding-bottom: 80px;
        }

        .info-wrapper {
            width: 100%;
        }

        .recipe-header-wrapper {
            flex-direction: column;
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
            margin: 0;
            margin-top: 30px;
            /* position: absolute;
            left: 20px;
            top: 20px; */

        }

        .title-wrapper {
            height: 500px;
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
            width: 100%;
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
            width: 100%;
        }

        .ingredients p {
            max-width: 35ch;
        }

        .steps h4 {
            margin-top: 20px;
        }

        .steps p {
            width: 90%;
            position: relative;
        }

        .steps {
            margin-bottom: 80px;
        }

        .edit, .delete {
            width: 300px;
        }

    }
</style>