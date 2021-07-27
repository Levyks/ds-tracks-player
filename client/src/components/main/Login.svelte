<script>
	import axios from 'axios';
  import { navigate } from 'svelte-routing';

  let isLoading = true;

  let availableGuilds = [];
  let guildId;
  let password;

  axios.get(`${__app['env'].API_URL}/auth/get-guilds`).then(response => {
    availableGuilds = response.data;
    isLoading = false;
  });

  function handleFormSubmit() {
		axios.post(`${__app['env'].API_URL}/auth/login`, {guildId, password}).then( response => {
      console.log(response.data);
      if(response.data.auth) {
				navigate('/player');
			} else {
				console.log("deu ruim", response.data.message);
			}
		}).catch(console.log);
	}
</script>

{#if isLoading}
  <h1>Loading</h1>
{:else}
  <div class="container mt-3">
    <div class="jumbotron">
      <form on:submit|preventDefault={handleFormSubmit}>
        <div class="form-group">
          <label for="username">Guild</label>
          <select class="custom-select" id="username" bind:value={guildId} required>
            <option selected></option>
            {#each availableGuilds as availableGuild}
              <option value={availableGuild.id}>{availableGuild.name}</option>
            {/each}
          </select>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" class="form-control" id="password" name="password" bind:value={password} required>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
{/if}