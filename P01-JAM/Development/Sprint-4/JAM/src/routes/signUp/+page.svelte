<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { BACKEND_URL } from "$lib/config.js";
  import { signup } from "$lib/API/userAPI.js";

  let email = "";
  let password = "";
  let error = "";
  let signupLoading = false;

  function makeid(length) {
    let result = "";
    let characters = "0123456789";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  let userName = "User" + makeid(4);

  async function handleSignUp() {
    console.log("Sign up clicked!");
    if (signupLoading) return;

    signupLoading = true;
    // Implement your sign-up logic here
    // e.g., sending a POST request to your API
    // and checking the response for successful registration

    // Mock error for demonstration
    if (email === "" || password === "") {
      //   error = "Please fill in all fields.";
      // } else if (password.length < 8) {
      //   error = "Password must be at least 8 characters long.";
    } else {
      // Api call to sign up

      try {
        const response = await signup(userName, email, password);
        console.log(response);
        signupLoading = false;
        goto("/");
      } catch (err) {
        signupLoading = false;
        error = "There was an error. Please try gain!";
        return;
      }
      // console.log("Sign up successful!");
    }
  }

  function navigateToSignIn() {
    goto("/signIn");
  }
</script>



<main
  class="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 font-garamond"
>
  <div
    class="bg-black bg-opacity-80 p-8 rounded-lg shadow-2xl text-center max-w-md w-full mx-auto"
  >
    <h1
      class="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300"
    >
      Sign Up
    </h1>
    <form class="flex flex-col gap-4">
      <div class="flex flex-col">
        <label for="email" class="text-lg font-medium text-gray-300 mb-2"
          >Email</label
        >
        <input
          type="email"
          id="email"
          bind:value={email}
          placeholder="Enter your email"
          class="bg-gray-700 rounded-full py-2 px-4 border-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div class="flex flex-col">
        <label for="password" class="text-lg font-medium text-gray-300 mb-2"
          >Password</label
        >
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Enter your password"
          class="bg-gray-700 rounded-full py-2 px-4 border-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {#if error}
        <p class="text-red-500 text-sm">{error}</p>
      {/if}
    </form>

    <button
      class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg w-full max-w-xs mt-4"
      on:click={()=>{handleSignUp()}}
      >
      Sign Up
    </button>

    <div class="mt-4 text-center">
      <button
        on:click={navigateToSignIn}
        class="text-purple-200 hover:text-purple-100 underline transition duration-300"
      >
        Already have an account? Sign In
      </button>
    </div>
  </div>
</main>
