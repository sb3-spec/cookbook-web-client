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
        let recipe;
        if (Object.keys(data).length === 0) {
            recipe = JSON.parse(localStorage.getItem('currentRecipe'));
            
            
        } else {
            recipe = data
        }
        title = recipe["title"];
        description = recipe["header"];
        ingredients = recipe["ingredients"];
        steps = recipe["steps"];
        cookTime = recipe["cook_time"];
        recipeId = recipe["id"];
        image_url = recipe["image_url"]

        ingredientCount = ingredients.length;
        stepCount = steps.length;
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
    function newItem(type) {
        if (type == "ingr") {
            ingredients.length++;
            ingredients[ingredients.length - 1] = "";
            ingredientCount++;
        } else if (type == "step") {
            steps.length++;
            steps[steps.length - 1] = "";
            stepCount++;
        } else {return}
    }

    function deleteItem(idx, type) {
        if (type == "ingr") {
            ingredients = ingredients.filter((_, index) => index !== idx);
            ingredientCount--;
        } else if (type == "step") {
            steps = steps.filter((_, index) => index !== idx);
            stepCount--;
        } else {return}
    }

</script>

<div class="recipe-edit-outer">
    <form on:submit|preventDefault={handleSubmit}>

        <div class="edit-recipe-header">
            <div style="display: flex; flex-direction: column;" class="title-and-description">
                <span style="display: flex; flex-direction: column">
                    <label for="title">Recipe Title</label>
                    <input type="text" name="title" bind:value={title}>
                </span>
                <span style="display: flex; flex-direction: column">
                    <label for="description">Description</label>
                    <textarea name="description" id="description" rows="6" bind:value={description}></textarea>
                </span>
                <span style="display: flex; flex-direction: column">
                    <label for="cook-time">Cook-Time</label>
                    <input type="text" name="cook-time" bind:value={cookTime} style="width: 40%;">
                </span>
            </div>
            <div class="tags-and-image">
                <div class="recipe-image">
                    <label for="image_url">Recipe Image</label>
                    <img src={image_url} alt={title}>
                    <input type="file" name="image_url" class="file-input">
                </div>
                <div class="tags" style="margin-top: 5px;">
                    <label for="tags">Tags</label>
                    <input type="text" name="tags" placeholder="Easy-Dinner">
                </div>
            </div>
        </div>

        <div class="instructions">
            <div class="steps-container">
                <div style="display: flex; position: relative;">
                    <h4>Steps</h4>
                    <button class="add-item" on:click|preventDefault={(e) => {newItem("step")}}>Add Step</button>
                </div>
                <ol class="steps-list">
                    {#each steps.map((value, index) => index) as idx}
                        <li style="position: relative;">
                            {#if idx !== 0}
                                <button on:click|preventDefault={() => {deleteItem(idx, "step")}} type="button">X</button>
                            {/if}
                            <textarea name={`step-${idx}`} id={`step-${idx}`} rows="3" bind:value={steps[idx]}></textarea>
                        </li>
                    {/each}
                </ol>
            </div>
            <div class="ingredients-container">
                <div style="display: flex; position: relative;">
                    <h4>Ingredients</h4>
                    <button class="add-item" on:click|preventDefault={(e) => {newItem("ingr")}}>Add Ingredient</button>
                </div>
                <ul>
                    {#each ingredients.map((value, index) => index) as idx}
                        <li style="position: relative">
                            {#if idx !== 0}
                                <button on:click|preventDefault={() => {deleteItem(idx, "ingr")}} type="button">X</button>
                            {/if}
                            <textarea name={`ingr-${idx}`} id={`ingr-${idx}`} rows="3" bind:value={ingredients[idx]}></textarea>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>

        

        <button type="submit" class="submit" disabled={!(firstIngredient || firstStep || title || description)}>Save Recipe</button>
    </form>
</div>

<style>

    .recipe-edit-outer {
        padding: 30px 0;
        position: relative;
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
        border-bottom: 1px solid var(--main-color);
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
        color: var(--main-color);
        background-color: white;
        width: 100%;
        right: 0;
        
    }

    .submit:hover {
        color: white;
        background-color: var(--main-color);
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
            margin: 0 auto;
            margin-top: 40px;
        }

        li textarea {
            width: 80%;
        }

        #description {
            width: 80%;
        }

        .instructions {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }

        .recipe-image img {
            max-width: 50%;
        }

        input { 
            width: 40%;
        }

        .edit-recipe-header {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
        
    }
</style>

