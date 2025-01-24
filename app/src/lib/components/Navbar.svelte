<script lang="ts">
	import { PUBLIC_PB_URL } from '$env/static/public';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { UsersResponse } from '$lib/types/pocketbase';
	import {
		IconBallBasketball,
		IconCalendarWeek,
		IconChartBar,
		IconHome
	} from '@tabler/icons-svelte';

	let { user }: { user: UsersResponse | undefined } = $props();
</script>

<div
	class="xs:px-4 to-background via-background/80 fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-transparent px-2 py-4"
>
	<div
		class="bg-secondary flex w-full flex-row items-center justify-between rounded-full border-[1.5px] p-3"
	>
		<!-- Home / Events page buttom -->
		<Button variant="ghost" size="icon" href="/" class="rounded-full ">
			<IconHome stroke={1.5} class="size-8" />
		</Button>

		<!-- Sports page button -->
		<Button variant="ghost" size="icon" href="/sports" class="rounded-full ">
			<IconBallBasketball stroke={1.5} class="size-8" />
		</Button>

		<!-- Calender page button -->
		<Button variant="ghost" size="icon" href="/calender" class="rounded-full ">
			<IconCalendarWeek stroke={1.5} class="size-8" />
		</Button>

		<!-- Leaderboard page button -->
		<Button variant="ghost" size="icon" href="/leaderboard" class="rounded-full ">
			<IconChartBar stroke={1.5} class="size-8" />
		</Button>

		<!-- Profile page button -->
		<Button variant="ghost" size="icon" href="/profile" class="rounded-full ">
			<div class="size-8 rounded-full">
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
