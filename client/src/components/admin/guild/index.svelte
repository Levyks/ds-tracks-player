<script>
  import { Router, Route } from "svelte-routing";

  import Edit from './Edit.svelte';
</script>

<Router>
  <Route path="/edit/:id" component={Edit} />
</Router>