<script>
  import axios from 'axios';
  import Modal from "sv-bootstrap-modal";

  export let isModalOpen;
  export let guildId;

  let password;
  let passwordConfirm;

  let waitingRequest = false;
  
  function handlePasswordChange() {
    if(password!=passwordConfirm) {
      password = "";
      passwordConfirm = "";
      return window.alert("Passwords don't match");
    } 
    waitingRequest = true;
    
    axios.post(`${__app['env'].API_URL}/admin/guild/${guildId}/set-password`,{password}).then(response => {
      waitingRequest = false;
      isModalOpen = false;
    }).catch(error => { 
      if(error.response.status === 401) {
        navigate('/admin/login');
      }
    });
  }
</script>

<Modal bind:open={isModalOpen}>
  <div class="modal-header">
      <h5 class="modal-title">Change password</h5>
      <button type="button" class="close" on:click={() => (isModalOpen = false)}>
        <span aria-hidden="true">&times;</span>
      </button>
  </div>
  {#if waitingRequest}
    <div class="d-flex justify-content-center align-items-center p-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  {:else}
    <form on:submit|preventDefault={handlePasswordChange}>
      <div class="modal-body">
        <div class="form-group">
          <label for="password">New password</label>
          <input type="password" class="form-control" id="password" bind:value={password} placeholder="Enter a new password">
        </div>
        <div class="form-group">
          <label for="password">Confirm the password</label>
          <input type="password" class="form-control" id="confirm-password" bind:value={passwordConfirm} placeholder="Repeat the new password">
        </div>
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary">Change Password</button>
      </div>
    </form>
  {/if}
</Modal>
