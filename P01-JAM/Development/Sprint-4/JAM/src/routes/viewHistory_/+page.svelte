<script>
  // @ts-nocheck

  import { user } from "$lib/userStore.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let playerEmail = $user.email
  let localPlayerHistory;
  let localHostHistory;


  onMount(() => {


  });

  const logout = async () => {
  try {
      // Call the logout method from your authentication service
      //await authService.logout();

      // Redirect to the login page or any other desired page after logout
      goto('/signIn');
  } catch (error) {
      console.error('Logout failed:', error);
  }
  };

</script>

<main>
<body class = "bg-purple-500">

  <div class="bg-purple-900 text-white py-4" >
    <div class="navbar mx-auto px-4 flex justify-between items-center">

      <!-- left aligned items -->
      <div>
        <a href = '/hostOrPlayer' class = "hover:text-white">Back</a>
      </div>

      <!-- center -->
      <div class ="ml-12 font-bold text-2xl flex items-center">
        <span>Quiz History</span>
      </div>     

      <!-- right aligned items -->
      <div class = "flex items-center space-x-12">
        <a href = '/' class = "hover:text-white">Home</a>
        <button onclick={logout} class="hover:text-white">Logout</button>
      </div>
     
    </div>
  </div>

  <!-- buttons -->
  <div class = "mr-12 flex justify-center items-center h-screen">
    <a  href = '/playerHistory' class = "bg-purple-900 hover:bg-purple-700 text-white font-bold py-4 px-8 text-2xl rounded transition duration-150 ease-in-out">Played</a>
    <div class="mx-12"></div>
    <a href = '/hostHistory' class = "bg-purple-900 hover:bg-purple-700 text-white font-bold py-4 px-8 text-2xl rounded transition duration-150 ease-in-out">Hosted</a>
  </div>
</body>
</main>













  