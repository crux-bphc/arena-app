<script lang="ts">
	import Button from './ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import type { EventRecWithStandAndBet } from '$lib/types/expand';
	import { formatTime } from '$lib/util/helpers';
	import Input from './ui/input/input.svelte';
	import type { BetsRecord } from '$lib/types/pocketbase';
	import { onMount } from 'svelte';

	interface BetPopupProps {
		isMinimized?: Boolean;
		event: EventRecWithStandAndBet;
		userBets: BetsRecord[];
	}
	let { isMinimized = false, event, userBets }: BetPopupProps = $props();
	let activeTeamId = $state(event.teams[0].id);
	let totalPool: number | null = $state(null);

	function calcTotalPool() {
		totalPool = event.betPools?.reduce((sum, obj) => sum + (obj.amount || 0), 0) ?? 0;
	}
	onMount(() => {
		calcTotalPool();
	});

	// calculates a team's percentage of bet pools
	function findTeamPoolPercent(id: string) {
		if (totalPool == null) return 1;

		const teamPool = event.betPools?.find((obj) => obj.team === id)?.amount ?? 0;
		const value = Math.floor((teamPool / totalPool) * 1000) / 10;

		return !Number.isNaN(value) ? value : 0;
	}
	// calculates a team's odds
	function findTeamOdds(id: string) {
		if (totalPool == null) return 1;

		const teamPool = event.betPools?.find((obj) => obj.team === id)?.amount ?? 0;
		const value = Math.floor((totalPool / teamPool) * 100) / 100;

		return !Number.isNaN(value) ? value : 1;
	}
	// calculates a user's already bet amount for a team
	function findBetAmount(teamId: string) {
		return userBets.find((obj) => obj.team == teamId && obj.event == event.id)?.amount ?? 0;
	}
</script>

{#if totalPool == null}
	<div class="text-foreground/50">...loading</div>
{:else}
	<Drawer.Root>
		<!-- popup trigger buttom -->
		<Drawer.Trigger>
			<Button
				variant="accent"
				class=" uppercase {isMinimized
					? 'rounded-lg px-6 text-sm'
					: 'rounded-xl px-8 py-6 text-lg'}">BET</Button
			>
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title class="line-clamp-2 w-full truncate text-wrap text-center text-3xl capitalize"
					>{event.title}</Drawer.Title
				>
				<Drawer.Description class="text-xl capitalize"
					>Bets close at {formatTime(event.startTime).toUpperCase()}</Drawer.Description
				>
			</Drawer.Header>
			<div class="flex w-full flex-col gap-8 p-4">
				<div class="flex max-h-[40vh] flex-col gap-2 overflow-auto">
					{#each event.teams as team, i}
						<button
							class="grid grid-cols-10 grid-rows-2 gap-y-1 rounded-xl p-3 {team.id == activeTeamId
								? 'bg-secondary'
								: ''}"
							onclick={() => {
								activeTeamId = team.id;
							}}
						>
							<!-- team name and odds -->
							<div class="col-span-8 flex flex-row items-end justify-between gap-1">
								<span class="truncate text-3xl font-bold">{team.name}</span>
								<span class="px-2 text-xl">x{findTeamOdds(team.id)}</span>
							</div>
							<!-- bet pool bar -->
							<div class="relative col-span-8 row-start-2 flex items-center justify-center">
								<div
									class="bg-background border-foreground/10 h-5 w-full items-center rounded-full border-2"
								></div>
								<div
									class="bg-accent absolute left-0 top-2 flex h-5 items-center rounded-full px-2 text-start text-sm font-bold"
									style="width: {findTeamPoolPercent(team.id)}%;"
								>
									{findTeamPoolPercent(team.id)}%
								</div>
							</div>
							<!-- bet amount -->
							<div class="col-span-2 row-span-2 flex items-center justify-center p-2 text-2xl">
								{findBetAmount(team.id)}
							</div>
						</button>
					{/each}
				</div>
				<!-- bet amount input -->
				<form class="flex w-full items-center justify-center gap-4">
					<div class="flex flex-row">
						<Button class="bg-secondary size-14 rounded-l-lg text-3xl" variant="ghost">+</Button>
						<Input
							type="number"
							class="hide-arrows border-secondary h-14 w-20 rounded-none border-x-0 border-y-2 p-1 text-center text-2xl"
							placeholder="custom amount"
							defaultValue={100}
						/>
						<Button class="bg-secondary size-14 rounded-r-lg text-3xl" variant="ghost">-</Button>
					</div>
					<Button type="submit" class="h-14 rounded-lg px-6 text-2xl">Bet</Button>
				</form>
			</div>
			<Drawer.Footer>
				<Drawer.Close class="py-4 text-xl">Cancel</Drawer.Close>
				<!-- small padding at the bottom -->
				<div class="h-12"></div>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
