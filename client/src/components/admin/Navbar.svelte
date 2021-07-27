<script>
  import axios from 'axios';
  import { navigate } from "svelte-routing";

  function handleLogout() {
    axios.get(`${__app['env'].API_URL}/admin/auth/logout`).then( response => {
      navigate('/admin/login');
		}).catch(console.log);
  }

</script>

<nav class="navbar navbar-expand navbar-dark bg-dark">
  <span class="navbar-brand">Admin Dashboard</span>
  <div>
    <ul class="navbar-nav">
      <li class="nav-item active">
        <button class="btn btn-link nav-link" on:click={handleLogout}>Logout</button>
      </li>
    </ul>
  </div>
</nav>

<style>
  .navbar {
    justify-content: space-between;
  }

  .btn-link:focus {
    box-shadow: none;
  }
</style>