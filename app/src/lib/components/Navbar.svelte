<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import type { UsersResponse } from '$lib/types/pocketbase';
	import { Calendar, ChartNoAxesColumn, Dribbble, House, User } from 'lucide-svelte';

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
			<House class="size-8" />
		</Button>

		<!-- Sports page button -->
		<Button variant="ghost" size="icon" href="/sports" class="rounded-full ">
			<Dribbble class="size-8" />
		</Button>

		<!-- Calender page button -->
		<Button variant="ghost" size="icon" href="/calender" class="rounded-full ">
			<Calendar class="size-8" />
		</Button>

		<!-- Leaderboard page button -->
		<Button variant="ghost" size="icon" href="/leaderboard" class="rounded-full ">
			<ChartNoAxesColumn class="size-8" />
		</Button>
		
		<!-- Profile page button -->
		<Button variant="ghost" size="icon" href="/profile" class="rounded-full ">
			<User class="size-8" />
		</Button>
	</div>
</div>
