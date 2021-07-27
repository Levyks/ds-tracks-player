<script>
  import axios from 'axios';
  import { navigate } from 'svelte-routing';
  import { io } from 'socket.io-client';

  import PlayerFooter from './PlayerFooter.svelte';

  let socket;
  let isLoading = true;
  let guild;
  let voiceChannels = [];

  socket = io();

  socket.on('connectResponse', response => {
    if(response.status === 401) {
      navigate('/login');     
    }
  });

  axios.get(`${__app['env'].API_URL}/auth/check`).catch(error => { 
    if(error.response.status === 401) {
      navigate('/login');
    }
  });

  axios.get(`${__app['env'].API_URL}/guild/get`).then(response => {
    guild = response.data;
    guild.tracks = Object.values(guild.tracks);
    console.log(guild.tracks);
    isLoading = false;

  }).catch(error => { 
    isLoading = false;
    if(error.response.status === 401) {
      navigate('/login');
    }
  });

  axios.get(`${__app['env'].API_URL}/guild/get-vcs`).then(response => {
    voiceChannels = response.data;
  }).catch(error => { 
    if(error.response.status === 401) {
      navigate('/login');
    }
  });

  function handleLogoutClick() {
    axios.get(`${__app['env'].API_URL}/auth/logout`).then( response => {
      navigate('/login');
		}).catch(console.log);
  }

  function formatTrackLength(seconds) {
    seconds = Math.round(seconds);
    const minutes = Math.floor(seconds/60);
    seconds = seconds % 60;
    return `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
  }

  function startPlaying(e) {
    const index = e.currentTarget.value;
    socket.emit('playTrack', {id: guild.tracks[index].id});
  }

  function handleVcChange(e) {
    socket.emit('joinVc',{id: e.target.value});
  }

</script>

{#if isLoading}
<h1>Loading</h1>
{:else}
<div class="container">
  <div class="jumbotron mt-3">
    <div class="header-wrapper">
      <div class="vcs-wrapper">
        <div class="form-group">
          <label for="username">Connected Channel</label>
          <select class="custom-select" id="username" on:change={handleVcChange}>
            <option value="" selected>None (disconnected)</option>
            <option disabled>-------------------</option>
            {#each voiceChannels as vc}
            <option value={vc.id}>{vc.name}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="title-wrapper">
        <h1>{guild.name}</h1>
      </div>
      <div class="logout-wrapper">
        <button class="btn btn-link" on:click={handleLogoutClick}>Logout</button>
      </div>
    </div>
    <div class="input-group rounded my-3">
      <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search"/>
      <span class="input-group-text border-0">
        <i class="fas fa-search"></i>
      </span>
    </div>
    <ul class="list-group">
      {#each guild.tracks as track, index}
        <li class="list-group-item">
          <strong>{track.name}</strong>
          <div>
            <span class="mr-2">{formatTrackLength(track.duration)}</span>
            <button class="btn btn-light text-success" value={index} on:click={startPlaying}>
              <i class="fas fa-play"></i>
            </button>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
{/if}

<PlayerFooter {socket} />


<style>
  .list-group-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-wrapper {
    width: 100%;
    display: flex;
  }

  .header-wrapper > div {
    display: flex;
    align-items: center;
  }

  .vcs-wrapper {
    flex: 1 1 25%;
  }

  .title-wrapper {
    justify-content: center;
    flex: 1 1 50%;
  }

  .title-wrapper > h1 {
    text-align: center;
  }

  .logout-wrapper {
    justify-content: flex-end;
    flex: 1 1 25%;
  }

  .jumbotron {
    padding-top: 32px;
  }
</style>