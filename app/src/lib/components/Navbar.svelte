<script lang="ts">
	import { PUBLIC_PB_URL } from '$env/static/public';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { UsersResponse } from '$lib/types/pocketbase';
	import { IconHomeFilled } from '@tabler/icons-svelte';
	import { IconFlagFilled } from '@tabler/icons-svelte';
	import { IconCalendarEvent } from '@tabler/icons-svelte';

	let { user }: { user: UsersResponse | undefined } = $props();
</script>

<div class="fixed inset-x-0 bottom-0 w-full p-3 xs:p-4">
	<div
		class="flex w-full flex-row items-center justify-around rounded-2xl bg-accent/35 p-2 backdrop-blur-lg xs:rounded-3xl xs:p-4"
	>
		<!-- Home / Events page buttom -->
		<Button variant="ghost" href="/" class="rounded-full ">
			<IconHomeFilled class="size-6 xs:size-8" />
		</Button>

		<!-- Leaderboard page button -->
		<Button variant="ghost" href="/leaderboard" class="rounded-full ">
			<IconFlagFilled class="size-6 xs:size-8" />
		</Button>

		<!-- Calender page button -->
		<Button variant="ghost" href="/calender" class="rounded-full ">
			<IconCalendarEvent class="size-6 xs:size-8" />
		</Button>

		<!-- Profile page button -->
		<Button variant="ghost" href="/profile" class="rounded-full ">
			<div class="size-6 rounded-full bg-foreground xs:size-8">
				{#if user}
					<img
						src={`${PUBLIC_PB_URL}/api/files/users/${user.id}/${user.avatar}`}
						alt="avatar"
						class="rounded-full"
					/>
				{/if}
			</div>
		</Button>
	</div>
</div>
