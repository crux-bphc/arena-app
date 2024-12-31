<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button/index.js';
	import { IconHomeFilled } from '@tabler/icons-svelte';
	import { IconFlagFilled } from '@tabler/icons-svelte';
	import { IconCalendarEvent } from '@tabler/icons-svelte';

	let { children } = $props();
</script>

{@render children()}
<div class="fixed inset-x-0 bottom-0 w-full p-4">
	<div
		class="bg-accent/10 flex w-full flex-row items-center justify-around rounded-3xl p-4 backdrop-blur-lg"
	>
		<Button variant="ghost" class=" rounded-full ">
			<IconHomeFilled class="text-text size-8" />
		</Button>
		<Button variant="ghost" class=" rounded-full ">
			<IconFlagFilled class="text-text size-8" />
		</Button>
		<Button variant="ghost" class=" rounded-full ">
			<IconCalendarEvent class="text-text size-8" />
		</Button>
		<Button variant="ghost" class=" rounded-full ">
			<!-- add avatar to this -->
			<div class="bg-foreground size-8 rounded-full"></div>
		</Button>
	</div>
</div>
