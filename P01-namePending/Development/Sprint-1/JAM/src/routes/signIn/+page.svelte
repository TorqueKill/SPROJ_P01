<script>
// @ts-nocheck


    import { goto } from "$app/navigation";
    // importing userStore.js
    import { user } from "$lib/userStore.js";
    import { onMount } from "svelte";
    
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

          const response = await fetch("http://localhost:3001/auth/signin", {
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
            
            $user.email = email;
            $user.password = password; //why tf are we storing the password? idk, co-pilot suggested it so though it was good coding pratice
            //save user to session storage but incoorporate timestamps to determine staleness/ timeout for session
            sessionStorage.setItem("user", JSON.stringify($user));
            // saving time stamp to sessionStorage
            sessionStorage.setItem("timestamp", Date.now());
            goto("/hostOrPlayer");
          }
          
        } catch (err) {

          error = "There was an error. Please try gain!";
          return;
        }
        
        
       


        

        // console.log("Sign in successful!");
      }
    }

    onMount(() => {
      // check if user is already logged in and time stamp us under three days
      // if so, redirect to home page
      if (sessionStorage.getItem("user") && (Date.now() - sessionStorage.getItem("timestamp") < 259200000)) {
        $user.email = JSON.parse(sessionStorage.getItem("user")).email;
        goto("/hostOrPlayer");
      }
    });

  </script>
  
  <form on:submit={handleSignIn}>
    <h1>Sign In</h1>
  
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
  
  <style>
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