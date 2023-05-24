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


    function handleNewItem(type) {

        if (type === "step") {
            stepCount++;
        } else if (type === "ingredient") {
            ingredientCount++;
        } else {
            return
        }
        
        const container = document.getElementById(`${type}-container`);
        var input = document.createElement('input');
        var label = document.createElement('label');
        let image = document.createElement('img');
    
        image.src = "/assets/cross.png";
        image.style.position = "absolute";
        image.style.width = "15px";
        image.style.transform = "translateX(-20px) translateY(-18px)";
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
            image.style.scale = "1.1";
            image.style.cursor = "pointer";
        };

        image.onmouseleave = function(e) {
            image.style.scale = "1";
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
        input.style.borderBottom = "1px solid black";
        input.style.backgroundColor = "transparent";
        input.style.width = "100%";
        input.style.outline = "none";
        input.style.color = "black";
        input.style.padding = "0";
        input.style.boxShadow = "none";
        input.style.fontSize = "16px";
        input.style.marginBottom = "15px";
        input.name = `${type}-${type === "ingredient" ? ingredientCount : stepCount}`;
        input.id = `${type}-${type === "ingredient" ?  ingredientCount : stepCount}`;

        // endregion: Input attributes


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
        res.image_url = await uploadImage(res.image_url);
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
    <form on:submit|preventDefault={handleNewRecipe}>
        <label for="title">Recipe Title</label>
        <input name="title" type="text" placeholder="Chicken Parmesean" class="title">

        <label for="header">Description</label>
        <textarea name="header" placeholder="Write a brief description"></textarea>

        <label for="cook_time">Cook-Time</label>
        <input type="text" name="cook_time">

        <label for="steps">Steps<button on:click|preventDefault={(e) => {handleNewItem("step")}}>Add Step</button></label>
        <div id="step-container">
            <label class="step-count" for="step-1">1.</label>
            <input type="text" placeholder="Heat oven to 350F" name="step-1">
        </div>

        <label for="ingredients">Ingredients<button on:click|preventDefault={(e) => {handleNewItem("ingredient")}}>Add Ingredient</button></label>
        <div id="ingredient-container">
            <label class="ingredient-count" for="ingredient">1.</label>
            <input type="text" placeholder="Rice Wine Vinegar: 3oz" name="ingredient">
        </div>

        <label for="tags">Tags</label>
        <input type="text" name="tags" placeholder="Easy-Dinner">

        <label for="image_url">Recipe Image</label>
        <input type="file" name="image_url" class="file-input">
        <button type="submit" class="submit">Submit</button>
    </form>
</div>

<style>

    .new-recipe-outer {
        padding-top: 3em;
    }

    #ingredient-container, #step-container {
        position: relative;
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

    button {
        border: none;
        font-weight: 400;
        font-size: 16px;
        position: absolute;
        right: 0;
        padding: .3em .5em;
        top: 5px;
    }

    textarea {
        min-height: 70px;
        border: none;
        color: black;
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

    #step-container label, #ingredient-container label {
        color: black;
        font-weight: 300;
    }

    label {
        color: black;
        font-weight: 300;
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

    .step-count, .ingredient-count {
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
    }
</style>