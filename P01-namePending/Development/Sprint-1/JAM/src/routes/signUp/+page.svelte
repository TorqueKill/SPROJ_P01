<script lang="js">

    import { goto } from "$app/navigation";


    let email = "";
    let password = "";
    let error = "";
  
    async function handleSignUp() {
      // Implement your sign-up logic here
      // e.g., sending a POST request to your API
      // and checking the response for successful registration
      console.log("Sign up clicked!");
  
      // Mock error for demonstration
      if (email === "" || password === "") {
      //   error = "Please fill in all fields.";
      // } else if (password.length < 8) {
      //   error = "Password must be at least 8 characters long.";
      } else {
        // Api call to sign up

        try {

          const response = await fetch("http://localhost:3001/auth/signup", {
            method: 'POST',
            headers: new Headers({
              "Content-Type": "application/json",
              
            }),
            body: JSON.stringify({
              "email": email,
              "password": password,
            }),
            // mode: "no-cors",
          });

          console.log(response);

          const data = await response.json();
          console.log(data);

          if (data.error) {
            error = data.error;
            return;

          } else {
            // console.log(data);
            // console.log(data.token);
            
            goto("/");
          }
          
        } catch (err) {

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
  
  <div class="container">
    <div class="logo">
      <!-- <img src="logo.png" alt="Logo" /> -->
    </div>
    <h1>Sign Up</h1>
    <form on:submit={handleSignUp}>
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
  
      <button type="submit">Sign Up</button>
    </form>
  
    <!-- <p>Already have an account? <a href={navigateToSignIn}>Sign In</a></p> -->
    <button on:click={navigateToSignIn}>Already have an account? Sign In</button>
  </div>
  
  <style>
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
  
    .logo {
      margin-bottom: 2rem;
    }
  
    form {
      display: flex;
      flex-direction: column;
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