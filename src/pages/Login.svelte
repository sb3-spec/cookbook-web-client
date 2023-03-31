<script>
    import firebase from 'firebase/compat/app';
    import {getAuth} from "firebase/auth";
    import * as firebaseui from "firebaseui";
    import 'firebaseui/dist/firebaseui.css'
    import { onMount } from 'svelte';

    onMount(() => {
        var ui = new firebaseui.auth.AuthUI(getAuth());
    
        ui.start('#firebase-auth-container', {
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.GithubAuthProvider.PROVIDER_ID
            ],
            signInSuccessUrl: "http://localhost:5173"
        });

    })

    

</script>

<div class="login-outer">
    <h1>Digital Cookbook</h1>
    <div id="firebase-auth-container">
        <h3>Login</h3>

    </div>
</div>

<style>
    .login-outer {
        background: var(--gradient-main);
        height: 100%;
        position: relative;
        padding: 3em;
    }

    h3 {
        font-weight: 100;
        font-size: 45px;
    }

    h1 {
        color: white;
    }

    #firebase-auth-container {
        max-width: 500px;
        margin: 0 auto;
        background-color: white;
        border-radius: 15px;
        padding-bottom: 1em;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    }
</style>