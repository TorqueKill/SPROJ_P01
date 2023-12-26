<script lang="js">
    import { goto } from "$app/navigation";


  let signupVisible = false;
  let signinVisible = false;

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
</script>

<div class="landing-page">
  <header>
    <h1>Welcome to JAM!</h1>
    <!-- <p>A brief description of your app and its benefits.</p> -->
  </header>

  <main>
    <div class="buttons">
      <button on:click={toggleSignup}>Sign Up</button>
      <button on:click={toggleSignin}>Sign In</button>
      <button on:click={()=>{goto("/hostOrPlayer")}}>Annonymous</button>
      <button on:click={()=>{goto("/dummyLogin")}}>Dummy Login</button>
      <button on:click={()=>{goto("/dummyLogin")}}>Dummy view history</button>

    </div>

    {#if signupVisible}
      <div class="signup-form">
        </div>
    {/if}

    {#if signinVisible}
      <div class="signin-form">
        </div>
    {/if}
  </main>
</div>

<style>
  .landing-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .signup-form,
  .signin-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
</style>
