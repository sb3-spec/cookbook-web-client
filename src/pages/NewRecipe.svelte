<script>
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { frontendHost } from "../utils/hosts";
    import { api } from "../utils/RecipeApi";
    import { grabItemNumber } from "./utils/new_recipe";
    import { uploadImage } from "../utils/uploadImage";
    import { CurrentRecipeStore } from "../stores/CurrentRecipe";

    $: stepCount = 1;
    $: ingredientCount = 1;
    $: tagCount = 0;  

    let scrapedRecipe = {};
    let scrapeUrl = "";

    let title = "";
    let description = "";
    let scraped_image_url = "";
    let initStep = "";
    let initIngredient = "";
    
    let auth = getAuth();
    // let user = auth.currentUser;
    // console.log(user);

    onAuthStateChanged(auth, user => {
        if (user !== null) {
            user = user;
        } else {
            user = null;
        }
    });

    async function tryScrapeRecipe() {
        api.get("/recipes/scrape/" + encodeURIComponent(scrapeUrl)).then(res => {

            // Fill out form from scraped data
            scrapedRecipe = res.data.data;
            title = scrapedRecipe["title"];
            description = scrapedRecipe["description"];
            scraped_image_url = scrapedRecipe["image"];



            scrapedRecipe["steps"].forEach((step, index) => {
                if (index === 1) {
                    initStep = step;
                } else {
                    handleNewItem("step", step);
                }
            })

            scrapedRecipe["ingredients"].forEach((ingr, index) => {
                if (index === 1) {
                    initIngredient = ingr;
                } else {
                    handleNewItem("ingredient", ingr);
                }
            })

            scrapeUrl = "";
            alert("Recipe scraped successfully");
        }).catch(err => {
            console.log(err);
        })
    }
    

    function handleNewItem(type, content) {
        

        if (type === "step") {
            stepCount++;
        } else if (type === "ingredient") {
            ingredientCount++;
        } else {
            return
        }
        
        const container = document.getElementById(`${type}-container`);
        var input = document.createElement('textarea');
        var label = document.createElement('label');
        let image = document.createElement('img');

        if (content) {
            input.value = content;
        }
    
        image.src = "/assets/cross.png";
        image.style.position = "absolute";
        image.style.width = "15px";
        image.style.right = "0px";
        image.style.transform = "translateY(-100px)";
        image.id = `${type}-delete-${type === "ingredient" ? ingredientCount : type === "step" ? stepCount : "tag"}`;

        // region: Element Functions
        function deleteItem(e) {

            // Grab the step to be deleted
            let targetElement = grabItemNumber(e.target.id);
            

            const input = document.getElementById(`${type}-${targetElement}`);
            const label = document.getElementById(`${type}-label-${targetElement}`);
            const img = document.getElementById(`${type}-delete-${targetElement}`);

            let parent = img.parentElement;

            let children = parent.children;

            if (type === "ingredient") {
                ingredientCount--;
            } else if (type === "step") {
                stepCount--;
            } else {
                return
            }


            // modify other children to allow higher level steps to be detracted if one of their predecessors is deleted
            // Like if we have 3 steps and we were to delete the middle step, the number of the final step needs to be reduced


            for (let i = 0; i < children.length; i++) {

                if (children[i].nodeName !== 'LABEL') {continue}

                let updateTarget = grabItemNumber(children[i].id);


                if (updateTarget > targetElement) {
                    if (isNaN(parseFloat(children[i].textContent))) {
                        console.log('HEllO!')
                        children[i].textContent = String(+children[i].textContent.slice(-1) - 1);
                    } else {
                        children[i].textContent = String(+children[i].textContent - 1);
                    }

                    
                }
            }

            input.parentElement.removeChild(input);
            label.parentElement.removeChild(label);
            img.parentElement.removeChild(img);

            
        }

        image.addEventListener("click", deleteItem, false);

        image.onmouseover = function(e) {
            image.style.cursor = "pointer";
        };

        image.onmouseleave = function(e) {
            image.style.cursor = "none";
        };

        // endregion: Element Functions

        // region: Label attributes

        label.textContent = `${type === "ingredient" ?  `${ingredientCount}.` : `${stepCount}.`}`;

        label.style.color = "black";
        label.style.fontSize = "16px";
        label.id = `${type}-label-${type === "ingredient" ?  ingredientCount : stepCount}`;

        // endregion: Label attributes

        // region: Input attributes

        input.style.border = 'none';
        input.style.width = "100%";
        input.rows = 3;
        input.style.outline = "none";
        input.style.color = "black";
        input.style.padding = "0";
        input.style.paddingLeft = "5px";
        input.style.boxShadow = "none";
        input.style.fontSize = "16px";
        input.style.marginBottom = "10px";
        input.name = `${type}-${type === "ingredient" ? ingredientCount : stepCount}`;
        input.id = `${type}-${type === "ingredient" ?  ingredientCount : stepCount}`;

        // endregion: Input attributes

        if (type === "ingredient") {
            label.style.opacity = "0";
        }


        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(image);
    }

    async function handleNewRecipe(e) {
        let user = auth.currentUser;
        let res = {}
        let recipe = new FormData(e.target);
        res.steps = []
        res.ingredients = [];

        // List key/value pairs
        for(let [name, value] of recipe) {
            if (name.includes('ingredient')) {
                res.ingredients.push(value);
            } else if (name.includes('step')) {
                res.steps.push(value);
            } else {
                res[name] = value;
            }
            // alert(`${name} = ${value}`); // key1 = value1, then key2 = value2
        }
        res.image_url = scraped_image_url ? scraped_image_url : await uploadImage(res.image_url);
        console.log(res.image_url);
        res.tags = [res.tags];

        let authConfig = {
            headers: {
                'X-AUTH-TOKEN': user.uid || '',
            }
        }
        
        await api.post("recipes", res, authConfig).then(res => {
            if (res.status == 200) {
                alert("Recipe created successfully");
                CurrentRecipeStore.set(res.data.data);
                window.location.replace(frontendHost + "#/" + res.data.data.title);
            }
        }).catch(err => {
            console.log(err);
            alert("Error creating recipe. Check console for more details.");
        });
    }
</script>

<div class="new-recipe-outer">
    <div class="option-container">
        <h4>Grab recipe from website?</h4>
        <label for="recipeUrl">Enter recipe URL</label>
        <span>
            <input type="text" bind:value={scrapeUrl} name="recipeUrl">
            <button on:click|preventDefault={tryScrapeRecipe} disabled={!scrapeUrl || !scrapeUrl.startsWith("https")}>Convert</button>
        </span>
    </div>
    <form on:submit|preventDefault={handleNewRecipe}>
        <label for="title">Recipe Title</label>
        <input bind:value={title} name="title" type="text" placeholder="Chicken Parmesean" class="title" id="title">

        <label for="header">Description</label>
        <textarea rows="5" bind:value={description} name="header" placeholder="Write a brief description"></textarea>

        <label for="cook_time">Cook-Time</label>
        <input type="text" name="cook_time">

        <label for="steps">Steps<button on:click|preventDefault={(e) => {handleNewItem("step")}}>Add Step</button></label>
        <div id="step-container">
            <label class="step-count" for="step-1">1.</label>
            <textarea rows="3" placeholder="Heat oven to 350F" name="step-1" bind:value={initStep}></textarea>
        </div>

        <label for="ingredients">Ingredients<button on:click|preventDefault={(e) => {handleNewItem("ingredient")}}>Add Ingredient</button></label>
        <div id="ingredient-container">
            <textarea rows="3" placeholder="Rice Wine Vinegar: 3oz" name="ingredient" bind:value={initIngredient}></textarea>
        </div>

        <label for="tags">Tags</label>
        <input type="text" name="tags" placeholder="Easy-Dinner">

        <label for="image_url">Recipe Image</label>
        {#if !scraped_image_url}
            <input type="file" name="image_url" class="file-input">
        {:else}
            {scraped_image_url}
        {/if}
        <button type="submit" class="submit" disabled={!title || !description}>Submit</button>
    </form>
</div>

<style>

    .new-recipe-outer {
        padding-top: 3em;
    }

    #ingredient-container, #step-container {
        position: relative;
        margin-bottom: 30px;
    }

    #step-container textarea, #ingredient-container textarea {
        width: 100%;
        font-size: 16px;
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

    .option-container {
        width: 400px;
        margin: 0 auto;
        padding-bottom: 40px;
    }

    .option-container input {
        margin: 0;
        height: 100%;
        padding: 0 5px;
        border: 1px solid black;
        background-color: white;
    }

    .option-container span {
        display: flex;
        height: 25px;
    }
    .option-container button {
        position: relative;
        box-sizing: content-box;
        height: 100%;
        border-radius: 0;
        padding: 0 5px;
        top: 0;
        border: 1px solid black;
        border-left: none;
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

    #step-container label {
        color: black;
        font-weight: 300;
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

    .step-count {
        font-size: 16px;
        color: black;
        margin-bottom: 15px;
        position: relative;
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

    @media (max-width: 900px) {
        .new-recipe-outer {
            margin-bottom: 40px;
        }

        .option-container {
            width: 70%;
        }
    }
</style>