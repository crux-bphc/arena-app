<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar, ChartNoAxesColumn, Dribbble, House, User } from 'lucide-svelte';
	import { page } from '$app/state';

	let check = (path: string) =>
		page.url.pathname == path
			? 'text-primary-foreground on-page'
			: '';
</script>

<div
	class="xs:px-4 to-background via-background/80 fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-transparent px-2 py-4"
>
	<div
		class="bg-secondary flex w-full flex-row items-center justify-between rounded-full border-[1.5px] p-3"
	>
		<!-- Home / Events page buttom -->
		<Button variant="navbar" size="icon" href="/" class="rounded-full {check('/')}">
			<House class="size-8" />
		</Button>

		<!-- Sports page button -->
		<Button variant="navbar" size="icon" href="/sports" class="rounded-full {check('/sports')}">
			<Dribbble class="size-8" />
		</Button>

		<!-- Calender page button -->
		<Button variant="navbar" size="icon" href="/calender" class="rounded-full {check('/calender')}">
			<Calendar class="size-8" />
		</Button>

		<!-- Leaderboard page button -->
		<Button
			variant="navbar"
			size="icon"
			href="/leaderboard"
			class="rounded-full {check('/leaderboard')}"
		>
			<ChartNoAxesColumn class="size-8" />
		</Button>

		<!-- Profile page button -->
		<Button variant="navbar" size="icon" href="/profile" class="rounded-full {check('/profile')}">
			<User class="size-8" />
		</Button>
	</div>
</div>
