<script>
  import { Link } from "svelte-routing";

  let isCollapsed = true;

  function handleCollapseButton() {
      isCollapsed = !isCollapsed;
  }

</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <Link class="navbar-brand" to="/">DS Song Effects</Link>
  <button class="navbar-toggler" on:click={handleCollapseButton}>
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="navbar-collapse collapse" class:show={!isCollapsed} id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <Link class="nav-link" to="/">Home</Link>
      </li>
      <li class="nav-item">
        <Link class="nav-link" to="/admin">Admin Dashboard</Link>
      </li>
    </ul>
  </div>
</nav>