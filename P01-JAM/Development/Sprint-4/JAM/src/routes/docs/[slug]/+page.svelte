<script>            
  
    import { page } from '$app/stores';
    import { goto } from "$app/navigation"; 
    import { onMount } from 'svelte';             
    console.log('path is: ', $page.url.pathname); 
    let id = $page.url.pathname.substring(6,);
    import { user } from "$lib/userStore.js";
    $user.gameid = id;

    onMount(async () => {

      const landing = () => {goto("/")};
      landing();
    })
       

</script>            
  
  
<!-- <h1>{id}</h1>
<button on:click = {() => {goto("/")}}> Go to Landing Page</button> -->