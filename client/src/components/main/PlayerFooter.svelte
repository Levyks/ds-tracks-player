<script>
	import { onMount } from 'svelte';

  export let socket;
  
  let track;
  let trackState;
  let progressBar;
  let stateChangedCausedBySocket = false;

  $: handleTrackChange(track);
  $: handleTrackStateChange(trackState);
  
  function handleTrackChange(newTrack) {
    if(stateChangedCausedBySocket) {
      stateChangedCausedBySocket = false;
      return;
    }

    if(!track) return;
    trackState = {
      status: "loading",
      currentTime: 3,
    }
    socket.emit('playTrack', {id: track.id});
  }

  socket.on('trackPlayingSync', data => {
    stateChangedCausedBySocket = true;
    console.log(data);
    track = data.track;
    trackState = data.state;
  });

  function handleTrackStateChange(newTrackState) {
    if(!track || !progressBar) return;
    const width = (newTrackState.currentTime/track.duration)*100;
    progressBar.style.width = `${width}%`;
  }

  onMount(() => {
    handleTrackStateChange(trackState);
  });

</script>

<nav class="navbar fixed-bottom navbar-light bg-light">
  <div class="progress-wrapper my-2">
    <div class="progress-bar" bind:this={progressBar}></div>
  </div>
  <div class="bottom-wrapper">
    <div class="left-section">
      {#if track}
      <h4>{track.name}</h4>
      {/if}
    </div>
    <div class="middle-section">
      {#if !track}
        <button class="btn btn-light play-pause-btn" disabled></button>
      {:else if trackState.status === "loading"}
        <button class="btn btn-light play-pause-btn">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </button>
      {:else if trackState.status === "loading"}
        <button class="btn btn-light play-pause-btn">
          <i class="fas fa-play"></i>
        </button>
      {/if}
    </div>
    <div class="right-section">
  
    </div>
  </div>
</nav>

<style>
  .progress-wrapper {
    width: 100%;
    background-color: lightgrey;
  }

  .progress-bar {
    width: 0%;
    height: 10px;
    background-color: green;
  }

  .play-pause-btn {
    color: green;
    background-color: #dadada;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    font-size: 2rem;
    text-align: center;
  }

  .bottom-wrapper {
    width: 100%;
    display: flex;
  }

  .bottom-wrapper > div {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .middle-section {
    justify-content: center;
  }

  .right-section {
    justify-content: flex-end;
  }

</style>