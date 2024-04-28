<script>
  // @ts-nocheck
  import { goto } from "$app/navigation";
  // importing userStore.js
  import { user } from "$lib/userStore.js";
  import { signin } from "$lib/API/userAPI.js";

  let email = "";
    let password = "";
    let errors = {};
    let signInLoading = false;
  
    async function handleSignIn() {
      if (signInLoading) return;
  
      signInLoading = true;
      errors = {}; // Reset errors on new sign-in attempt
  
      try {
        const response = await signin(email, password);
        console.log(response);
        $user.email = email;
        goto("/hostOrPlayer");
      } catch (e) {
        console.log("Error: ", e);
        if (e.errors) {
          errors = e.errors; // Assuming errors are in `data.errors` from your API
          console.log(errors);
        } else if (e.response) {
          if (e.response.status === 401) {
            errors.general = 'Invalid email or password.';
          } else if (e.response.status === 500) {
            errors.general = 'An unexpected error occurred.';
          }
        } else {
          errors.general = 'An unexpected error occurred.'; // Fallback error message

        }

      } finally {
        signInLoading = false;
      }
    }
  </script>
  
  <main class="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 font-garamond">
    <div class="bg-black bg-opacity-80 p-8 rounded-lg shadow-2xl text-center max-w-md w-full mx-auto">
      <h1 class="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
        Sign In
      </h1>
      <form class="flex flex-col gap-4">
        <div class="flex flex-col">
          <label for="email" class="text-lg font-medium text-gray-300 mb-2">Email</label>
          <input type="email" id="email" bind:value={email} placeholder="Enter your email" class="bg-gray-700 rounded-full py-2 px-4 border-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          {#if errors.email}
            <p class="text-red-500 text-sm">{errors.email}</p>
          {/if}
        </div>
  
        <div class="flex flex-col">
          <label for="password" class="text-lg font-medium text-gray-300 mb-2">Password</label>
          <input type="password" id="password" bind:value={password} placeholder="Enter your password" class="bg-gray-700 text-white rounded-full py-2 px-4 border-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          {#if errors.password}
            <p class="text-red-500 text-sm">{errors.password}</p>
          {/if}
        </div>
  
        {#if errors.general}
          <p class="text-red-500 text-sm">{errors.general}</p>
        {/if}
      </form>
      <div class="flex items-center justify-center">
        <button class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg w-full max-w-xs mt-4" on:click={handleSignIn}>
          Sign In
        </button>
      </div>
    </div>
  </main>
  
