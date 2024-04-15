<script lang="js">
  // @ts-nocheck
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { SESSION_TIMEOUT } from "$lib/config.js";
  import { BACKEND_URL } from "$lib/config.js";
  import { user } from "$lib/userStore.js";
  import { signin } from "$lib/API/userAPI.js";

  let signupVisible = false;
  let signinVisible = false;
  let loadingUserSession = false;

  function toggleSignup() {
    // signupVisible = !signupVisible;
    // signinVisible = false;
    goto("/signUp");
  }

  function toggleSignin() {
    goto("/signIn");
    // signinVisible = !signinVisible;
    // signupVisible = false;
  }

  async function loginUserSession(email, password) {
    //call api to login the user (async)
    //if successful, redirect to the appropriate page

    //check if user has @dev in their email
    //if they do, send req for /dev/auth/signin

    try {
      let data = await signin(email, password);
      console.log(data);

      $user.email = email;
      sessionStorage.setItem("user", JSON.stringify($user));

      //create obj to store email, password, timestamp and user data
      let userObj = {
        email: email,
        password: password,
        timestamp: Date.now(),
        userData: {},
      };

      //save user to local storage
      localStorage.setItem("user-session", JSON.stringify(userObj));

      goto("/hostOrPlayer");
    } catch (err) {
      console.log(err?.response?.data || "An error occurred while signing in!");
      loadingUserSession = false;
      return;
    }
  }

  onMount(async () => {
    console.log("Landing page mounted");
    loadingUserSession = true;
    //try to load user from local storage
    let user = JSON.parse(localStorage.getItem("user-session"));
    console.log(user);
    if (user) {
      //check if the user is still valid
      let currentTime = Date.now();
      let timeElapsed = currentTime - user.timestamp;
      if (timeElapsed > SESSION_TIMEOUT) {
        //clear the user from local storage
        localStorage.removeItem("user-session");
        loadingUserSession = false;
      } else {
        //call api to login the user (async)
        //if successful, redirect to the appropriate page
        //await loginUserSession(user.email, user.password);
        loadingUserSession = false;
      }
    } else {
      loadingUserSession = false;
    }
  });
</script>

<!-- <main>
  <body>
    <div class="landing-page">
      <h1 class="text-3xl font-bold underline">
        Hello world!
      </h1>
    {#if !loadingUserSession}
      <h1>Welcome to JAM!</h1>
       <p>A brief description of your app and its benefits.</p> -->

<!-- <meta name="viewport" content="width=device-width, initial-scale=1" />
      <div class="buttons">
        <button on:click={toggleSignup}>Sign Up</button>
        <button on:click={toggleSignin}>Sign In</button>
        <button
          on:click={() => {
            goto("/hostOrPlayer");
          }}>Annonymous</button
        >
      </div> -->

<!-- {#if signupVisible} -->
<!-- <div class="signup-form" /> -->
<!-- {/if} -->

<!-- {#if signinVisible} -->
<!-- <div class="signin-form" /> -->
<!-- {/if} -->

<!-- {:else} -->
<!-- </body> -->
<!-- </main> -->

<main
  class="bg-cover bg-center min-h-screen flex flex-col items-center justify-center p-4 font-garamond"
  style="background-image: url('/purple_image.png'); filter: brightness(70%);"
>
  {#if !loadingUserSession}
    <div
      class="bg-white bg-opacity-80 p-8 rounded-lg shadow-2xl text-center max-w-2xl mx-auto"
    >
      <h1
        class="text-6xl font-extrabold mb-2 bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300"
      >
        JAM
      </h1>
      <p class="mb-6 text-lg font-medium black">
        Dive into the thrill of learning with JAM - a dynamic quiz platform that
        challenges your knowledge and reasoning.
      </p>
      <h3 class="text-2xl font-semibold italic mb-8 black">
        "Learning made thrilling - one quiz at a time!"
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 place-items-center">
        <button
          on:click={toggleSignup}
          class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg w-full max-w-xs"
        >
          Sign Up
        </button>
        <button
          on:click={toggleSignin}
          class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg w-full max-w-xs"
        >
          Sign In
        </button>
        <button
          on:click={() => goto("/hostOrPlayer")}
          class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg w-full max-w-xs"
        >
          Join Anonymously
        </button>
      </div>
    </div>
  {:else}
    <div class="text-center">
      <p>Loading...</p>
    </div>
  {/if}
</main>
