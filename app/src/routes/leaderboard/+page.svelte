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
	let { data } = $props();

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

	// finds user's position
	function findUserPos() {
		if (!leaderboard) return 0;
		const index = leaderboard.users.findIndex((user) => user.id == data.user?.id);
		return index != -1 ? index : '?';
	}

	// gets the color based on user's postion
	function calcColor(user: UsersResponse, index: number, isSolid: boolean) {
		const commonClasses = 'font-bold';
		switch (index) {
			case 0:
				return isSolid
					? 'text-gold'
					: `bg-gradient-to-br bg-clip-text text-transparent from-gold to-gold via-gold/50  ${commonClasses}`;
			case 1:
				return isSolid
					? 'text-silver'
					: `bg-gradient-to-br bg-clip-text text-transparent from-silver to-silver via-silver/50  ${commonClasses}`;
			case 2:
				return isSolid
					? 'text-bronze'
					: `bg-gradient-to-br bg-clip-text text-transparent from-bronze to-bronze via-bronze/50 ${commonClasses}`;
			default: {
				if (data.user?.id == user.id) return `text-primary ${commonClasses}`;
				else return '';
			}
		}
	}
</script>

{#if leaderboard !== null}
	<div class="mx-auto max-w-2xl overflow-hidden rounded-lg p-4 text-white">
		<h1 class="my-6 text-center text-3xl font-bold">Leaderboard</h1>
		<!-- bottom row for user's card -->
		{#if data.user}
			<div
				class="text-primary-foreground fixed bottom-24 left-0 z-10 flex w-full items-center justify-center px-4 py-2"
			>
				<div
					class="bg-primary flex w-full items-center justify-center rounded-xl px-6 py-4 text-xl"
				>
					<div class="w-1/6 text-center text-xl font-bold">
						{findUserPos()}
					</div>
					<div class="w-2/3 font-bold">{data.user.name}</div>
					<div class="w-1/6">{data.user.balance}</div>
				</div>
			</div>
		{/if}
		<Table.Root>
			<Table.Body class="w-screen">
				{#each leaderboard.users as user, i}
					<Table.Row>
						<div class=" my-1 flex w-full items-center justify-center rounded-xl">
							<Table.Cell class="w-1/6 text-center text-xl {calcColor(user, i, true)}">
								{#if i == 0}
									<Crown class="text-gold/70 size-8" />
								{:else}
									{i + 1}
								{/if}
							</Table.Cell>
							<Table.Cell class="w-2/3 max-w-[22ch] truncate text-xl {calcColor(user, i, false)}">
								{user.name}
							</Table.Cell>
							<Table.Cell class="w-1/6 text-xl {calcColor(user, i, true)}">
								{user.balance}
							</Table.Cell>
						</div>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{:else}
	<Loader />
{/if}
