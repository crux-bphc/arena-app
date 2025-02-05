<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import PWAPrompt from 'svelte-ios-pwa-prompt';

	let { children } = $props();
</script>

<Toaster position="top-center" />
{@render children()}
<Navbar />
<PWAPrompt
	promptOnVisit={1}
	timesToShow={3}
	copyClosePrompt="Close"
	permanentlyHideOnDismiss={false}
/>
