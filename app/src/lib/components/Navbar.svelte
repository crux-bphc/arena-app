<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar, ChartNoAxesColumn, Dribbble, House, User } from 'lucide-svelte';
	import { page } from '$app/state';

	const check = (path: string) =>
		page.url.pathname == path ? 'text-primary-foreground on-page' : '';
</script>

<div
	class="fixed inset-x-0 bottom-0 z-10 w-full bg-gradient-to-b from-transparent via-background/80 to-background px-2 py-4 xs:px-4 { page.url.pathname == '/login' ? 'hidden' : '' }"
>
	<div
		class="bg-secondary flex w-full flex-row items-center justify-between rounded-full border-[1.5px] p-3"
	>
		<!-- Home / Events page buttom -->
		<Button variant="navbar" size="icon" href="/" class="rounded-full {check('/')}">
			<House class="size-7" />
		</Button>

		<!-- Sports page button -->
		<Button variant="navbar" size="icon" href="/sports" class="rounded-full {check('/sports')}">
			<Dribbble class="size-7" />
		</Button>

		<!-- Calendar page button -->
		<Button variant="navbar" size="icon" href="/calendar" class="rounded-full {check('/calendar')}">
			<Calendar class="size-7" />
		</Button>

		<!-- Leaderboard page button -->
		<Button
			variant="navbar"
			size="icon"
			href="/leaderboard"
			class="rounded-full {check('/leaderboard')}"
		>
			<ChartNoAxesColumn class="size-7" />
		</Button>

		<!-- Profile page button -->
		<Button variant="navbar" size="icon" href="/profile" class="rounded-full {check('/profile')}">
			<User class="size-7" />
		</Button>
	</div>
</div>
<!-- bottom padding for all pages -->
<div class="h-28 w-screen bg-transparent"></div>
