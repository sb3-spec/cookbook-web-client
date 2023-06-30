<script>
    import { onDestroy } from "svelte";
    import { api } from  "../utils/RecipeApi";
    import { CurrentRecipeStore } from "../stores/CurrentRecipe";
    import { frontendHost } from "../utils/hosts";
    import { getAuth, onAuthStateChanged } from "firebase/auth";

    // Recipe fields

    let firstStep = "";
    let firstIngredient = "";
    let title = "";
    let description = "";
    let cookTime = "";
    let recipeId = "";
    let image_url = "";
    
    let ingredients = [];
    let steps = [];

    // Counter for steps and ingredients
    let ingredientCount = 1;
    let stepCount = 1;

    let auth = getAuth();

    let user;
    // let user = auth.currentUser;
    // console.log(user);


    let unsubscribe = CurrentRecipeStore.subscribe(data => {

        if (Object.keys(data).length === 0) {
            let recipe = JSON.parse(localStorage.getItem('currentRecipe'));
            
            title = recipe["title"];
            description = recipe["header"];
            ingredients = recipe["ingredients"];
            steps = recipe["steps"];
            cookTime = recipe["cook_time"];
            recipeId = recipe["id"];
            image_url = recipe["image_url"]
        } else {
            title = data["title"];
            description = data["header"];
            ingredients = data["ingredients"];
            steps = data["steps"];
            cookTime = data["cook_time"];
            recipeId = data["id"];
            image_url = data["image_url"]

        }
    });

    onDestroy(() => {
        unsubscribe();
    })

    async function handleSubmit() {
        let recipe = {
            "title": title,
            "header": description,
            "cook_time": cookTime,
            "steps": steps,
            "ingredients": ingredients,
            "image_url": ""

        }

        let authConfig = {
            headers: {
                'X-AUTH-TOKEN': auth.currentUser.uid || '',
            }
        }
        api.patch(`recipes/${recipeId}`, recipe, authConfig).then(res => {
            CurrentRecipeStore.set(res.data.data);
            localStorage.setItem("currentRecipe", JSON.stringify(res.data.data));
            window.location.href = frontendHost + `#/${title}`;
        }).catch(err => {
            console.log(err);
            alert("Error: " + err.message);
        })
    }

    // Just like the create recipe page, this section 
    // will either add a new and empty ingredient/step 
    // to the recipe form. 
    function newItem(e, type) {
        let targetContainer;
        if (type == "ingredient") {
            targetContainer = document.querySelector('.ingredients-container');
        } else if (type == "step") {
            targetContainer = document.querySelector('.steps-container');
        } else {return}
    }

</script>

<div class="recipe-edit-outer">
    <form on:submit|preventDefault={handleSubmit}>
        <label for="title">Recipe Title</label>
        <input type="text" name="title" bind:value={title}>

        <label for="description">Description</label>
        <textarea name="description" id="description" rows="6" bind:value={description}></textarea>

        <label for="cook-time">Cook-Time</label>
        <input type="text" name="cook-time" bind:value={cookTime} style="width: 40%;">

        <div class="instructions">
            <div class="steps-container">
                <div style="display: flex; position: relative;">
                    <h4>Steps</h4>
                    <button class="add-item">Add Step</button>
                </div>
                <ol class="steps-list">
                    {#each steps.map((value, index) => index) as idx}
                        <li>
                            <textarea name={`step-${idx}`} id={`step-${idx}`} rows="3" bind:value={steps[idx]}></textarea>
                        </li>
                    {/each}
                </ol>
            </div>
            <div class="ingredients-container">
                <div style="display: flex; position: relative;">
                    <h4>Ingredients</h4>
                    <button class="add-item">Add Ingredient</button>
                </div>
                <ul>
                    {#each ingredients.map((value, index) => index) as idx}
                        <li>
                            <textarea name={`ingr-${idx}`} id={`ingr-${idx}`} rows="3" bind:value={ingredients[idx]}></textarea>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>

        <div class="tags-and-image">
            <div class="tags" style="margin-top: 20px;">
                <label for="tags">Tags</label>
                <input type="text" name="tags" placeholder="Easy-Dinner">
            </div>
            <div class="recipe-image">
                <label for="image_url">Recipe Image</label>
                <img src={image_url} alt={title}>
                <input type="file" name="image_url" class="file-input">
            </div>
        </div>

        <button type="submit" class="submit" disabled={!(firstIngredient || firstStep || title || description)}>Save Recipe</button>
    </form>
</div>

<style>

    .recipe-edit-outer {
        padding: 30px 0;
    }

    .tags {
        display: flex;
        flex-direction: column;
    }

    #description {
        margin-bottom: 20px;
    }

    .add-item {
        position: absolute;
        padding: 3px 10px;
        height: 35px;
        top: 20px;
    }

    .instructions {
        display: flex;
        flex-direction: column;
    }
    form {
        box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
        display: flex;
        flex-direction: column;
        max-width: 80%;
        margin: 0 auto;
        text-align: left;
        background-color: var(--background);
        border: 1px solid #bdbdbd;
        padding: 2em 3em 3em 3em;
        min-height: 400px;
        position: relative;
    }

    textarea {
        width: 40%;
        margin: 0;
    }

    

    ul {
        list-style: none;
    }

    ol, ul {
        margin: 0;
        padding: 0;
    }

    ol li::marker {
        font-size: 20px;
    }

    button {
        border: none;
        font-weight: 400;
        font-size: 16px;
        position: absolute;
        right: 0;
        padding: .3em .5em;
        top: 5px;
        right: 20%;
    }

    button:disabled {
        color: gray;
        background-color: white;
    }

    button:disabled:hover {
        color: gray;
    }

    textarea {
        border: none;
        color: black;
        font-size: 16px;
        width: 100%;
    }

    input {
        background-color: transparent;
        border: none;
        border-bottom: 1px solid var(--accent);
        color: black;
        font-size: 16px;
        font-weight: 100;
        width: 100%;
    }

    input {
        margin-bottom: 15px;
    }

    label {
        color: black;
        font-weight: 400;
        font-size: 23px;
        margin-bottom: 5px;
        position: relative;
    }

    input::-webkit-input-placeholder {
        font-weight: 100;
        color:black;
        opacity: .7;
    }

    input::-ms-input-placeholder {
        font-weight: 100;
        color:black;
    }

    input:focus, input:focus-visible, input:focus, textarea:focus-visible {
        outline: none;
    }

    .file-input {
        border: none;
    }

    .submit {
        bottom: 0;
        /* max-height: 30px; */
        position: relative;
        font-size: 20px;
        color: white;
        background-color: var(--primary-button);
        width: 100%;
        right: 0;
        
    }

    .submit:hover {
        color: var(--primary-button);
        background-color: white;
        transition: all 200ms;
    }

    h4 {
        color: black;
        font-weight: 400;
        font-size: 23px;
        margin-bottom: 5px;
        position: relative;
    }

    .recipe-image {
        display: flex;
        flex-direction: column;
    }

    .tags-and-image {
        display: flex;
        flex-direction: column;
    }


    @media (min-width: 1400px) {
        .submit {
            width: 30%;
        }

        li textarea {
            width: 80%;
        }

        #description {
            width: 40%;
        }



        .instructions {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }

        .recipe-image img {
            max-width: 40%;
        }

        input { 
            width: 40%;
        }
        
    }
</style>

