<script lang="ts">
	import { PUBLIC_PB_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte';
	import type { UsersResponse } from '$lib/types/pocketbase';

	interface LeaderboardData {
		users: UsersResponse[];
	}
	let leaderboard = $state<LeaderboardData | null>(null);

	async function getLeaderboardData() {
		try {
			const response = await fetch(`api/user/leaderboard`);
			if (!response.ok) {
				console.error(`Failed to fetch leaderboard data: ${response.status}`);
				return;
			}
			leaderboard = await response.json();
		} catch (e) {
			console.error(`Failed to fetch leaderboard data: ${e}`);
		}
	}

	onMount(() => {
		getLeaderboardData();
	});
</script>

{#if leaderboard !== null}
	<div class="mx-auto max-w-2xl overflow-hidden rounded-lg p-4 text-white">
		<h1 class="mb-6 text-center text-3xl font-bold">Leaderboard</h1>

		<ul class="space-y-6">
			{#each leaderboard.users as user, index}
				<li
					class="grid grid-cols-[0.5fr_2fr_1fr] items-center gap-[16px] rounded-lg bg-gray-800 p-4 shadow-lg"
				>
					<span class="position text-center text-xl font-bold">
						{index + 1}
					</span>
					<span class="user-details flex items-center">
						<span
							class="ml-4 max-w-[200px] overflow-hidden truncate text-ellipsis text-lg font-semibold"
						>
							{user.name}
						</span>
						{#if index === 0}
							<span class="ml-2 text-yellow-400">🏆</span>
						{:else if index === 1}
							<span class="ml-2 text-gray-300">🥈</span>
						{:else if index === 2}
							<span class="ml-2 text-yellow-600">🥉</span>
						{/if}
					</span>
					<span class="text-center text-lg font-bold">
						{user.balance}
					</span>
				</li>
			{/each}
		</ul>
	</div>
{:else}
	<Loader />
{/if}
