<script>
// @ts-nocheck

    import {goto} from "$app/navigation";
    import {user} from "$lib/userStore.js";

    function makeid(length) {
        let result = "";
        let characters = "abcdefghijklmnopqrstuvwxyz";
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function handleSignIn() {
        $user.email = email;
        goto("/hostOrPlayer");
    }

    let email = makeid(5) + "@gmail.com";

</script>

<main>
    <h1>
        Dummy Login
    </h1>
    <input type="text" bind:value={email} placeholder="email">
    <button on:click={handleSignIn}>Sign In</button>
    
</main>

