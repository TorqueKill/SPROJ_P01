<script>
  // @ts-nocheck
  import { goto } from "$app/navigation";
  // importing userStore.js
  import { user } from "$lib/userStore.js";
  import { BACKEND_URL } from "$lib/config.js";
  import { signin } from "$lib/API/userAPI.js";

  let email = "";
  let password = "";
  let error = "";

  async function handleSignIn() {
    console.log("Sign in clicked!");

    if (email === "" || password === "") {
      error = "Please fill in all fields.";
      //   } else if (email !== "valid@email.com") {
      //     error = "Invalid email or password.";
    } else {
      // Api call to sign in
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
        console.log(err);
        error = err?.response?.data || "An error occurred while signing in!";
        return;
      }

      // console.log("Sign in successful!");
    }
  }
</script>

<!-- <main>
  <body>
    <div class="container">
      <h1>Sign In</h1>
      <form on:submit={handleSignIn}>
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          placeholder="Enter your email"
        />

        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Enter your password"
        />

        {#if error}
          <p class="error">{error}</p>
        {/if}

        <button type="submit">Sign In</button>
      </form>
    </div>
  </body>
</main>

<style>
  body {
    background: #7801a8;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 10px;
    font-family: JejuGothic, sans-serif;
    color: #c49eff;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 4rem;
    border-radius: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    font-family: JejuGothic, sans-serif;
    font-size: 18px;
    background-color: #018198;
    color: #c49eff;
    border: None;
    margin-bottom: 2rem;
  }

  input {
    max-width: 100%;
    font-family: JejuGothic, sans-serif;
    font-size: 18px;
    border-radius: 5rem;
    padding-left: 0.5rem;
    border: None;
  }

  button {
    background-color: #ccc;
    border: none;
    color: white;
    padding: 5px 25px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 140px;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s ease;
  }

  button:hover {
    background-color: #c49eff;
  }
  

  @media (max-width: 768px) {
    form {
      width: 90%;
      padding: 1rem;
    }

    input,
    button {
      padding: 8px;
      font-size: 12px;
      border-radius: 15px;
    }
  }

  @media (min-width: 769px) {
    form {
      padding: 2rem;
    }

    button {
      padding: 10px 25px;
      font-size: 18px;
      border-radius: 20px;
    }
  }
</style> -->

<main
  class="bg-cover bg-center min-h-screen flex items-center justify-center p-4"
  style="background-image: url('/img.png'); filter: brightness(75%)"
>
  <div
    class="bg-black bg-opacity-80 p-8 rounded-lg shadow-2xl text-center max-w-md w-full mx-auto"
  >
    <h1
      class="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300"
    >
      Sign In
    </h1>
    <form class="flex flex-col gap-4" on:submit={handleSignIn}>
      <div class="flex flex-col">
        <label for="email" class="text-lg font-medium text-gray-300 mb-2"
          >Email</label
        >
        <input
          type="email"
          id="email"
          bind:value={email}
          placeholder="Enter your email"
          class="bg-gray-700 text-white rounded-full py-2 px-4 border-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          class="bg-gray-700 text-white rounded-full py-2 px-4 border-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {#if error}
        <p class="text-red-500 text-sm">{error}</p>
      {/if}
    </form>
    <div class="flex items-center justify-center">
      <button
        type="submit"
        class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg w-full max-w-xs mt-4"
      >
        Sign In
      </button>
    </div>
  </div>
</main>
