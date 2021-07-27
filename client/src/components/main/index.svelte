<script>
  import {Router,  Route } from "svelte-routing";

  import Login from './Login.svelte';
  import Player from './Player.svelte';
</script>

<Router>
  <Route path="/" component={Player} />
  <Route path="/player" component={Player} />

  <Route path="/login" component={Login} />
</Router>


