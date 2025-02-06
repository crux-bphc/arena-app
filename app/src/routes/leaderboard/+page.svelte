<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte';
	import * as Table from '$lib/components/ui/table';
	import type { UsersResponse } from '$lib/types/pocketbase';
	import { Crown } from 'lucide-svelte';

	interface LeaderboardData {
		users: UsersResponse[];
	}
	let leaderboard = $state<LeaderboardData | null>(null);

	async function getLeaderboardData() {
		try {
			const response = await fetch(`api/user/leaderboard`);
			const json = await response.json();
			if (!response.ok) {
				throw new Error('message' in json ? json.message : `API returned ${response.status}`);
			}
			leaderboard = json;
		} catch (e) {
			console.error(`Failed to fetch leaderboard data: ${e}`);
			toast.error('Failed to fetch leaderboard data!');
		}
	}

	onMount(() => {
		getLeaderboardData();
	});
</script>

{#if leaderboard !== null}
	<div class="mx-auto max-w-2xl overflow-hidden rounded-lg p-4 text-white">
		<h1 class="my-6 text-center text-3xl font-bold">Leaderboard</h1>

		<Table.Root>
			<Table.Body class="w-screen">
				{#each leaderboard.users as user, i}
					<Table.Row class="boorder-b-0 {i == 0 ? 'bg-primary text-primary-foreground' : ''}">
						<Table.Cell class="w-1/6 text-center text-2xl">
							{#if i == 0}
								<Crown class=" text-primary-foreground size-8" />
							{:else}
								{i + 1}
							{/if}
						</Table.Cell>
						<Table.Cell class="w-2/3 max-w-[22ch] truncate text-xl font-bold"
							>{user.name}</Table.Cell
						>
						<Table.Cell class="w-1/6 text-xl">{user.balance}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{:else}
	<Loader />
{/if}
