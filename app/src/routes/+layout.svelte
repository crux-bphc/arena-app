<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button/index.js';
	import { IconHomeFilled } from '@tabler/icons-svelte';
	import { IconFlagFilled } from '@tabler/icons-svelte';
	import { IconCalendarEvent } from '@tabler/icons-svelte';

	let { children } = $props();
</script>

{@render children()}
<div class="fixed inset-x-0 bottom-0 w-full xs:p-4 p-3">
	<div
		class="bg-accent/10 flex w-full flex-row items-center justify-around xs:rounded-3xl rounded-2xl xs:p-4 p-2 backdrop-blur-lg"
	>
		<Button variant="ghost" class="rounded-full ">
			<IconHomeFilled class="text-text xs:size-8 size-6" />
		</Button>
		<Button variant="ghost" class="rounded-full ">
			<IconFlagFilled class="text-text xs:size-8 size-6" />
		</Button>
		<Button variant="ghost" class="rounded-full ">
			<IconCalendarEvent class="text-text xs:size-8 size-6" />
		</Button>
		<Button variant="ghost" class="rounded-full ">
			<!-- add avatar to this -->
			<div class="bg-foreground xs:size-8 size-6 rounded-full"></div>
		</Button>
	</div>
</div>
