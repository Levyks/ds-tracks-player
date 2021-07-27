<script>
  export let socket;
  
  let track;
  let trackState;
  let currentTime;
  let progressBar;
  let trackDurationTimer;

  const PROGRESS_BAR_STEP = 0.5;

  $: handleTrackStateChange(trackState);
  $: handleCurrentTimeChange(currentTime); 

  socket.on('trackPlayingSync', data => {
    if(data.track){
      track = data.track;
      clearInterval(trackDurationTimer);
    } 
    trackState = data.state; 
  });

  function handleTrackStateChange(newTrackState) {
    if(!newTrackState) return;
    currentTime = newTrackState.currentTime;
    switch(newTrackState.status) {
      case "playing":
        trackDurationTimer = setInterval(() => {
          if(currentTime + PROGRESS_BAR_STEP > track.duration) {
            clearInterval(trackDurationTimer);
            currentTime = track.duration;
            return;
          }
          currentTime += PROGRESS_BAR_STEP;
        }, PROGRESS_BAR_STEP*1000);
        break;
      case "paused":
        clearInterval(trackDurationTimer);
        break;
      case "finished":
        currentTime = track.duration;
        break;
    }
  }

  function handleCurrentTimeChange(newTime) {
    if(!track) return;
    const width = (currentTime/track.duration)*100;
    progressBar.style.width = `${width}%`;
  }

  function handlePlayClick() {
    if(trackState.status === "paused") {
      socket.emit('resumeTrack');
    } else {
      socket.emit('playTrack', {id: track.id});
    }
    
  }

  function handlePauseClick() {
    socket.emit('pauseTrack');
  }
  

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
      {#if !track || !trackState}
        <button class="btn btn-light play-pause-btn" disabled></button>
      {:else if trackState.status === "loading"}
        <button class="btn btn-light play-pause-btn" disabled>
          <div class="w-100 text-center">
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div> 
        </button>
      {:else if trackState.status === "playing"}
        <button class="btn btn-light play-pause-btn pause-btn" on:click={handlePauseClick}>
          <i class="fas fa-pause"></i>
        </button>
      {:else if trackState.status === "finished" || trackState.status === "paused"}
        <button class="btn btn-light play-pause-btn play-btn" on:click={handlePlayClick}>
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
    transition: width .5s linear;
  }

  .play-pause-btn {
    background-color: #dadada;
    width: 64px;
    height: 64px;
    border-radius: 50%;

    text-align: center;
  }

  .pause-btn {
    color: #4200db;
    font-size: 2rem;
  }

  .play-btn {
    color: green;
    font-size: 2rem;
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