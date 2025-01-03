<script lang="ts">
	import { PUBLIC_PB_URL } from '$env/static/public';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { UsersResponse } from '$lib/types/pocketbase';
	import { IconHomeFilled } from '@tabler/icons-svelte';
	import { IconFlagFilled } from '@tabler/icons-svelte';
	import { IconCalendarEvent } from '@tabler/icons-svelte';

	let { user }: { user: UsersResponse | undefined } = $props();
</script>

<div class="xs:p-4 fixed inset-x-0 bottom-0 w-full p-3">
	<div
		class="bg-accent/35 xs:rounded-3xl xs:p-4 flex w-full flex-row items-center justify-around rounded-2xl p-2 backdrop-blur-lg"
	>
		<!-- Home / Events page buttom -->
		<Button variant="ghost" href="/" class="rounded-full ">
			<IconHomeFilled class="xs:size-8 size-6" />
		</Button>

		<!-- Leaderboard page button -->
		<Button variant="ghost" href="/leaderboard" class="rounded-full ">
			<IconFlagFilled class="xs:size-8 size-6" />
		</Button>

		<!-- Calender page button -->
		<Button variant="ghost" href="/calender" class="rounded-full ">
			<IconCalendarEvent class="xs:size-8 size-6" />
		</Button>

		<!-- Profile page button -->
		<Button variant="ghost" href="/profile" class="rounded-full ">
			<div class="bg-foreground xs:size-8 size-6 rounded-full">
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
