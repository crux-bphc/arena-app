<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';

	let { data, children } = $props();
</script>

{@render children()}
<Navbar user={data.user}/>
