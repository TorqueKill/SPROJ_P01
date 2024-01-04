<script>
  // @ts-nocheck

  import { goto } from "$app/navigation";
  import { user } from "$lib/userStore.js";

  let email = "";
  let password = "";
  let error = "";

  async function handleSignIn() {
    console.log("Sign in clicked!");

    if (email === "" || password === "") {
      error = "Please fill in all fields.";
    } else {
      // API call to sign in
      try {
        const response = await fetch("http://localhost:3001/auth/signin", {
          method: 'POST',
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            "email": email,
            "password": password,
          }),
        });

        console.log(response);

        const data = await response.json();
        console.log(data);

        if (data.error) {
          error = data.error;
          return;
        } else {
          // successful sign-in
          $user.email = email;
          $user.password = password;
          sessionStorage.setItem("user", JSON.stringify($user));
          console.log("User: ", $user);
          console.log("UserName: ", $user.userName);
          goto("/dummyViewHistory");
        }
      } catch (err) {
        error = "There was an error. Please try again!";
        return;
      }
    }
  }
</script>

<main>
  <h1>Dummy Login</h1>
  <label for="email">Email:</label>
  <input type="email" id="email" bind:value={email} placeholder="Enter your email" />

  <label for="password">Password:</label>
  <input type="password" id="password" bind:value={password} placeholder="Enter your password" />

  {#if error}
    <p class="error">{error}</p>
  {/if}
  
  <button on:click={handleSignIn}>Sign In</button>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 300px;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .error {
    color: red;
  }
</style>
