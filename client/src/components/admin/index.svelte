<script>
  import {Router,  Route } from "svelte-routing";

  import Login from './Login.svelte';
  import Dashboard from './Dashboard.svelte';
  import Guild from './guild';
</script>

<Router>
  <Route path="/" component={Dashboard} />
  <Route path="/login" component={Login} />

  <Route path="/dashboard" component={Dashboard} />
  <Route path="/guild/*" component={Guild} />
</Router>


