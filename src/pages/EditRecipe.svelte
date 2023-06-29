<script>
    import { onDestroy } from "svelte";
    import { api } from  "../utils/RecipeApi";
    import { CurrentRecipeStore } from "../stores/CurrentRecipe";
    import { frontendHost } from "../utils/hosts";
    import { getAuth, onAuthStateChanged } from "firebase/auth";

    let firstStep = "";
    let firstIngredient = "";
    let title = "";
    let description = "";
    let cookTime = "";
    let recipeId = "";
    let image_url = "";
    
    let ingredients = [];
    let steps = [];

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
            "description": description,
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

</script>

<div class="recipe-edit-outer">
    <form on:submit|preventDefault={handleSubmit}>
        <label for="title">Recipe Title</label>
        <input type="text" name="title" bind:value={title}>

        <label for="description">Description</label>
        <textarea name="description" id="description" rows="6" bind:value={description}></textarea>

        <label for="cook-time">Cook-Time</label>
        <input type="text" name="cook-time" bind:value={cookTime}>

        <div class="steps-container">
            <h4>Steps</h4>
            <ol class="steps-list">
                {#each steps.map((value, index) => index) as idx}
                    <li>
                        <textarea name="step-1" id="step-1" rows="4" bind:value={steps[idx]}></textarea>
                    </li>
                {/each}
            </ol>
        </div>

        <div class="ingredients-container">
            <h4>Ingredients</h4>
            <ul>
                {#each ingredients.map((value, index) => index) as idx}
                    <li>
                        <textarea name="ingr-1" id="" rows="3" bind:value={ingredients[idx]}></textarea>
                    </li>
                {/each}
            </ul>
        </div>

        <label for="tags">Tags</label>
        <input type="text" name="tags" placeholder="Easy-Dinner">

        <label for="image_url">Recipe Image</label>
        <img src={image_url} alt={title}>
        <input type="file" name="image_url" class="file-input">

        <button type="submit" class="submit" disabled={!(firstIngredient || firstStep || title || description)}>Submit</button>
    </form>
</div>

<style>

    .recipe-edit-outer {
        padding-top: 30px;
    }

    form {
        box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
        display: flex;
        flex-direction: column;
        max-width: 600px;
        margin: 0 auto;
        text-align: left;
        background-color: var(--background);
        border: 1px solid #bdbdbd;
        padding: 2em 3em 3em 3em;
        min-height: 400px;
        position: relative;
    }

    textarea {
        width: 100%;
    }

    ul {
        list-style: none;
    }

    ol, ul {
        margin: 0;
        padding: 0;
    }

    button {
        border: none;
        font-weight: 400;
        font-size: 16px;
        position: absolute;
        right: 0;
        padding: .3em .5em;
        top: 5px;
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

    input, textarea {
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
</style>

