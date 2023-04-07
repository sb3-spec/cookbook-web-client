<script>
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { onMount } from "svelte";
  import Router from 'svelte-spa-router';

  import { app } from "./utils/firebase";
  import { db } from "./utils/db";
  import Navbar from './lib/Navbar.svelte';
  import Dashboard from "./pages/Dashboard.svelte";
  import Login from "./pages/Login.svelte";
  import NewRecipe from "./pages/NewRecipe.svelte";
  import { api } from "./utils/RecipeApi";
    import Recipe from "./pages/Recipe.svelte";
    import { frontendHost } from "./utils/hosts";

  // VARS

  $: authLoading = true;

  const routes = {
    '/': Dashboard,
    '/login': Login,
    '/new-recipe': NewRecipe,
    '/:recipeTitle': Recipe
  }


  

  onMount(() => {
    let auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        user = user;

        // sync users from firebase to my backend
        // attemps to create a new user on the backend with every auth change, returns an error if the user exists
        api.post("chefs", JSON.stringify({'username': user.displayName, 'firebase_id': user.uid})).then(res => {
          console.log(1, res.status);
      
          console.log("New User successfully created on backend");
        }).catch(err => {
          console.log("User already exists on backend");
          // if (err.status === 400) {
            
          // }
        })
      } else {
        window.location.replace(frontendHost + "#/login");
      }
    })
  });
</script>

<main>
  <Navbar />
  <Router {routes} />
</main>

<style>
  main {
    height: 100%;
    overflow-y: scroll;
  }
</style>
