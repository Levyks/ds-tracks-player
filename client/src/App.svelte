<script>
	import { Router, Route } from "svelte-routing";

	import Navbar from './components/Navbar.svelte';
	import Admin from './components/admin';
	import Main from './components/main';

</script>

<Router>
  <Navbar />
  <Route path="/admin/*" component={Admin} />
	<Route path="/*" component={Main} />
</Router>