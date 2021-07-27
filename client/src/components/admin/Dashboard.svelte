<script>
  import axios from 'axios';
  import { navigate, Link } from 'svelte-routing';

  import Navbar from './Navbar.svelte';

  let isLoading = true;

  axios.get(`${__app['env'].API_URL}/admin/auth/check`).catch(error => { 
    if(error.response.status === 401) {
      navigate('/admin/login');
    }
  });

  let guilds = [];

  axios.get(`${__app['env'].API_URL}/admin/guild/get`).then(response => {
    isLoading = false;
    guilds = response.data;
  }).catch(error => { 
    isLoading = false;
    if(error.response.status === 401) {
      navigate('/admin/login');
    }
  });

</script>

{#if isLoading}
  <h1>Loading</h1>
{:else}
  <Navbar />
  <div class="container mt-3">
    <div class="jumbotron text-center">
      <h1>Guilds</h1>
      <ul class="list-group text-left mt-3">
        {#each guilds as guild}
          <li class="list-group-item">
            <img src={guild.iconUrl || '/assets/img/discord.png'} alt="Guild Icon" class="guild-icon mr-2">
            <h2 class="guild-name">{guild.name}</h2>
            <Link to={`/admin/guild/edit/${guild.id}`}>
              <i class="fas fa-edit"></i>
            </Link>
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if}

<style>
  li {
    display: flex;
    align-items: center;
  }

  .guild-name {
    flex-grow: 1;
  }

  .guild-icon {
    height: 96px;
    width: 96px;
    border-radius: 50%;
  }

  .fa-edit {
    font-size: 2rem;
  }
</style>