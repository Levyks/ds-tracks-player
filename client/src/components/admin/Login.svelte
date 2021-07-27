<script>
	import axios from 'axios';
	import { navigate } from "svelte-routing";

	let username = "";
	let password = "";

	function handleFormSubmit() {
		axios.post(`${__app['env'].API_URL}/admin/auth/login`, {username, password}).then( response => {
			if(response.data.auth) {
				navigate('/admin/dashboard');
			} else {
				console.log("deu ruim", response.data.message);
			}
		}).catch(console.log);
	}
</script>

<div class="container mt-3">
	<div class="jumbotron">
		<form on:submit|preventDefault={handleFormSubmit}>
			<div class="form-group">
				<label for="username">Username</label>
				<input class="form-control" id="username" name="username" bind:value={username} required>
			</div>
			<div class="form-group">
				<label for="password">Password</label>
				<input type="password" class="form-control" id="password" name="password" bind:value={password} required>
			</div>
			<button type="submit" class="btn btn-primary">Submit</button>
		</form>
	</div>
</div>