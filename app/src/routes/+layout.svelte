<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button/index.js';
	import { IconHomeFilled } from '@tabler/icons-svelte';
	import { IconFlagFilled } from '@tabler/icons-svelte';
	import { IconCalendarEvent } from '@tabler/icons-svelte';

	let { children } = $props();
</script>

{@render children()}
<div class="xs:p-4 fixed inset-x-0 bottom-0 w-full p-3">
	<div
		class="bg-accent/35 xs:rounded-3xl xs:p-4 flex w-full flex-row items-center justify-around rounded-2xl p-2 backdrop-blur-lg"
	>
		<!-- Home / Events page buttom -->
		<Button variant="ghost" href="/" class="rounded-full ">
			<IconHomeFilled class="text-text xs:size-8 size-6" />
		</Button>

		<!-- loaderboard page button -->
		<Button variant="ghost" href="/leaderboard" class="rounded-full ">
			<IconFlagFilled class="text-text xs:size-8 size-6" />
		</Button>

		<!-- Calender page button -->
		<Button variant="ghost" href="/calender" class="rounded-full ">
			<IconCalendarEvent class="text-text xs:size-8 size-6" />
		</Button>

		<!-- Profile page button -->
		<Button variant="ghost" href="/profile" class="rounded-full ">
			<!-- add avatar to this -->
			<div class="bg-foreground xs:size-8 size-6 rounded-full"></div>
		</Button>
	</div>
</div>
