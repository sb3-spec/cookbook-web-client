<script>
    import firebase from 'firebase/compat/app';
    import {getAuth} from "firebase/auth";
    import * as firebaseui from "firebaseui";
    import 'firebaseui/dist/firebaseui.css'
    import { onMount } from 'svelte';
    import { frontendHost } from '../utils/hosts';

    onMount(() => {
        var ui = new firebaseui.auth.AuthUI(getAuth());

        const uiConfig = {
            signInOptions: [
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    fullLabel: "Login with Email",
                    requireDisplayName: true,
                    title: "Blah",
                    customParameters: {
                        prompt: 'consent'
                    }
                },
                
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    fullLabel: "Login with Google"
                },
                {
                    provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
                    fullLabel: "Login with Github"
                }
            ],
            signInFlow: 'popup',
            signInSuccessUrl: frontendHost
        };
    
        ui.start('#firebase-auth-container', uiConfig);

    })

    

</script>

<div class="login-outer">
    <div class="logo-container">
        <img src="./assets/cookbook.png" alt="Cookbook icon">
        <h2>Cookbook</h2>
    </div>
    <div id="firebase-auth-container">
        <h3>Login</h3>
    </div>
</div>

<style>
    .login-outer {
        background-color: var(--background);
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .logo-container {
        display: flex;
        cursor: pointer;
        white-space: nowrap;
        margin: 0 auto;
        padding: 0 10px;
        padding-right: 40px;
        gap: 10px;
    }

    .logo-container img {
        height: 90px;
        display: block;
        margin: auto;
    }

    h2 {
        color: var(--primary-button);
        font-size: 60px;
    }

    h3 {
        font-weight: 400;
        font-size: 45px;
    }

    #firebase-auth-container {
        width: 400px;
        margin: 0 auto;
        background-color: var(--text);
        backdrop-filter: blur(20px);
        border-radius: 15px;
        padding-bottom: 1em;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    }

    @media (max-width: 900px) {
        h2 {
            font-size: 40px;
        }

        h3 {
            font-size: 35px;
            font-weight: 300;
        }

        .logo-container img {
            height: 40px;
        }

        #firebase-auth-container {
            width: 80%;
            margin: 0 auto;
            background-color: var(--text);
            backdrop-filter: blur(20px);
            border-radius: 15px;
            padding-bottom: 1em;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        }
    }
</style>