<script>
  import axios from 'axios';

  export let track;
  export let guildId;
  export let index;
  export let removeTrackWithIndex;

  let isNew = !track.id;
  let isEditing = isNew;
  let request = {waiting: false};
  
  function handleEditClick() {
    isEditing = true;
    request = {waiting: false};
  }

  function handleSaveClick() {
    if(!window.confirm("Do you want to save the modifications?")) return;

    const apiEndpoint = track.id ? `/admin/guild/${guildId}/update-track/${track.id}` : `/admin/guild/${guildId}/add-track`;

    request = {waiting: true};

    axios({
      method: isNew ? 'post' : 'put',
      url:`${__app['env'].API_URL}${apiEndpoint}`,
      data: track
    }).then(response => {
      if(!track.id) track.id = response.data.id;

      request = {
        waiting: false,
        completed: true,
        successful: true,
      };

      setTimeout(() => {
        request.showSuccessIcon = true;
      }, 50);

      setTimeout(() => {
        isEditing = false;
      }, 1000);
  
    }).catch(error => { 
      request = {
        waiting: false,
        completed: true,
        successful: false,
        error: (error && error.response && error.response.data && error.response.data.message) || "Something went wrong",
      };

      setTimeout(() => {
        request.showErrorIcon = true;
      }, 50);

      if(error.response.status === 401) {
        navigate('/admin/login');
      }
    });
  }

  function handleDeleteClick() {
    if(!window.confirm(`Do you want to delete the track "${track.name}"?`)) return;

    axios.delete(`${__app['env'].API_URL}/admin/guild/${guildId}/delete-track/${track.id}`).then(response => {
      removeTrackWithIndex(index);
    }).catch(error => { 
      if(error.response.status === 401) {
        navigate('/admin/login');
      }
    });
  }

</script>

<div class="row">
  <div class="col-10">
    <div class="form-group row">
      <label for="track-name" class="col-sm-2 col-form-label">Name</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="track-{index}-name" bind:value={track.name} disabled={!isEditing}>
      </div>
    </div>
    <div class="form-group row">
      <label for="track-url" class="col-sm-2 col-form-label">URL</label>
      <div class="col-sm-10">
        <input type="url" class="form-control" id="track-{index}-url" bind:value={track.url} disabled={!isEditing}>
      </div>
    </div> 
    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="track-{index}-available" bind:checked={track.available} disabled={!isEditing}  >
      <label class="form-check-label" for="track-available">
        Available for playback
      </label>
    </div>  
  </div>
  <div class="col-2 right-section">
    <div class="my-2">
      {#if !isEditing}
        <button class="btn btn-light" on:click={handleEditClick}><i class="fas fa-edit"></i></button>
      {:else}
        <button class="btn btn-light text-primary" on:click={handleSaveClick}><i class="fas fa-save"></i></button>
      {/if}
    </div>
    <div class="my-2">
      {#if !isEditing}
        <button class="btn btn-light text-danger" on:click={handleDeleteClick}><i class="far fa-trash-alt"></i></button>
      {:else}
        {#if request.waiting}
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        {/if}
        <div class="text-success request-status-icon" class:d-none={!(request.completed && request.successful)} class:show={request.showSuccessIcon}>
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="text-danger request-status-icon" class:d-none={!(request.completed  && request.error)} class:show={request.showErrorIcon} title={request.error}>
          <i class="fas fa-times-circle"></i>
        </div>
      {/if}
    </div>
  </div>
</div> 

<style>
  .right-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  .request-status-icon {
    font-size: 32px;
    opacity: 0;
    transition: opacity 1s;
  }

  .show {
    opacity: 1;
  }

</style>