<script>
  import axios from 'axios';
  import { navigate } from 'svelte-routing';

  import Navbar from '../Navbar.svelte';
  import Track from './Track.svelte';
  import ChangePassword from './ChangePassword.svelte';
  
  export let id;
  let guild;
  let isLoading = true;
  let isModalOpen = false;

  axios.get(`${__app['env'].API_URL}/admin/guild/get/${id}`).then(response => {
    guild = response.data;
    guild.tracks = Object.values(guild.tracks);
    isLoading = false;
  }).catch(error => { 
    if(error.response.status === 401) {
      navigate('/admin/login');
    }
  });

  function handleGoBackClick() {
    navigate('/admin/dashboard');
  }

  function handleNewTrackClick() {
    guild.tracks.push({name: "", url: "", available: true});
    guild = guild;
  }

  function removeTrackWithIndex(index) {
    guild.tracks.splice(index, 1);
    guild = guild;
  }

</script>

{#if isLoading}
  <h1>Loading</h1>
{:else}
  <Navbar />
  <div class="container mt-3">
    <div class="jumbotron">
      <div class="d-flex justify-content-between">
        <button class="btn btn-light" on:click={handleGoBackClick}><i class="fas fa-arrow-left"></i></button>
        <button type="submit" class="btn btn-primary" on:click={()=> (isModalOpen = true)}>Change Password</button>
      </div>
      <div>
        <div class="text-center">
          <h1>{guild.name}</h1>
          <h6 class="text-secondary">{guild.id}</h6>
        </div> 
      </div>
      <hr>
      <div>
        <div class="tracks-header">
          <h1>Tracks</h1>
          <button type="button" class="btn btn-light" on:click={handleNewTrackClick}>
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="tracks-body">
          <ul class="list-group">
            {#each guild.tracks as track, index}
            <li class="list-group-item">
              <Track {track} guildId={guild.id} {index} {removeTrackWithIndex}/>
            </li>
            {/each}
          </ul>
        </div>
      </div>
      
    </div>
  </div>
  
  <ChangePassword bind:isModalOpen={isModalOpen} guildId={guild.id}/>
{/if}



<style>
  .tracks-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>



