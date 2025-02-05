<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import * as Drawer from '$lib/components/ui/drawer';
	import type { EventRecWithStandAndBet } from '$lib/types/expand';
	import { formatTime, getBalance } from '$lib/util/helpers';
	import { Input } from '$lib/components/ui/input';
	import type { BetsRecord } from '$lib/types/pocketbase';
	import { onMount } from 'svelte';
	import { HandCoins, UsersRound, Wallet, X } from 'lucide-svelte';
	
	interface BetPopupProps {
		isMinimized?: Boolean;
		event: EventRecWithStandAndBet;
		userBets: BetsRecord[];
		balance: number;
	}
	let { isMinimized = false, event, userBets, balance }: BetPopupProps = $props();

	let dialogOpen = $state(false);
	let activeTeamId = $state(event.teams.at(0)?.id);
	let bets = $state(userBets);
	let userBalance = $state(balance);
	let totalPool: number | null = $state(null);
	let betAmount: number = $state(0);

	async function loadBalance() {
		userBalance = await getBalance(fetch);
	}

	async function submitBet() {
		if (betAmount <= 0) {
			toast.error('Bet amount must be positive!');
			return;
		}

		try {
			const res = await fetch('/api/user/bet', {
				method: 'POST',
				body: JSON.stringify({ teamId: activeTeamId, eventId: event.id, amount: betAmount })
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error('message' in data ? data.message : `API returned ${data.status}`);
			}

			toast.success(`Successfully bet ${betAmount} in ${event.title}!`);
			loadBalance();

			let userBetRecord = bets.find((obj) => obj.team == activeTeamId && obj.event == event.id);
			if (userBetRecord) userBetRecord.amount = data.amount;
			
			dialogOpen = false;
		} catch (error) {
			console.error(`Failed to place bet: ${error}`);
			toast.error(`Failed to place bet!`);
		}
	}

	function calcTotalPool() {
		totalPool = event.betPools?.reduce((sum, obj) => sum + (obj.amount || 0), 0) ?? 0;
	}
	onMount(() => {
		calcTotalPool();
		if (event.teams.length > 0) 
		{
			activeTeamId = event.teams[0].id;
			betAmount = findBetAmount(activeTeamId);
		}
	});

	// calculates a team's percentage of bet pools
	function findTeamPoolPercent(id: string) {
		if (totalPool == null) return 1;

		const teamPool = event.betPools?.find((obj) => obj.team === id)?.amount ?? 0;
		const value = (100 * teamPool) / totalPool;

		return !Number.isNaN(value) ? value : 0;
	}
	// calculates a team's odds
	function findTeamOdds(id: string) {
		if (totalPool == null) return 1;

		const teamPool = event.betPools?.find((obj) => obj.team === id)?.amount ?? 0;
		const value = totalPool / teamPool;

		return !Number.isNaN(value) && Number.isFinite(value) ? value : 1;
	}
	// calculates a user's already bet amount for a team
	function findBetAmount(teamId?: string) {
		return bets.find((obj) => obj.team == teamId && obj.event == event.id)?.amount ?? 0;
	}
</script>

{#if totalPool == null}
	<div class="text-foreground/50">...loading</div>
{:else}
	<Drawer.Root bind:open={dialogOpen}>
		<!-- popup trigger buttom -->
		<Drawer.Trigger>
			<Button
				variant="accent"
				class=" uppercase {isMinimized
					? 'rounded-lg px-4 text-sm'
					: 'rounded-xl px-6 py-6 text-lg'}"><HandCoins /></Button
			>
		</Drawer.Trigger>
		<Drawer.Content>
			<!-- close icon -->
			<div class="relative w-full">
				<Drawer.Close class="absolute right-4 top-0 rounded-full p-2 text-xl">
					<X class="size-8" />
				</Drawer.Close>
			</div>
			<Drawer.Header>
				<Drawer.Title class="line-clamp-2 w-full truncate text-wrap text-center text-3xl capitalize"
					>{event.title}</Drawer.Title
				>
				<Drawer.Description class="text-xl capitalize"
					>Bets close at {formatTime(event.startTime).toUpperCase()}</Drawer.Description
				>
			</Drawer.Header>
			<div class="flex w-full items-center justify-between px-6 text-xl font-bold capitalize">
				<!-- balance tag -->
				<div class="flex items-center justify-center">
					<div
						class="bg-primary text-primary-foreground flex items-center justify-center rounded-l-lg px-4 py-3"
					>
						<Wallet class="size-7" />
					</div>
					<div
						class="bg-secondary text-secondary-foreground flex items-center justify-center rounded-r-lg px-4 py-3"
					>
						{userBalance}
					</div>
				</div>
				<!-- user count tag -->
				<div class="flex items-center justify-center">
					<div
						class="bg-secondary text-secondary-foreground flex items-center justify-center rounded-l-lg px-4 py-3"
					>
						{event.userCount}
					</div>
					<div
						class="bg-primary text-primary-foreground flex items-center justify-center rounded-r-lg px-4 py-3"
					>
						<UsersRound class="size-7" />
					</div>
				</div>
			</div>

			<!-- standings -->
			<div class="flex w-full flex-col p-4">
				<div class="flex max-h-[40vh] flex-col gap-1 overflow-auto">
					{#each event.teams as team, i}
						<button
							class="grid grid-cols-10 grid-rows-2 gap-y-1 rounded-xl p-3 {team.id == activeTeamId
								? 'bg-secondary'
								: ''}"
							onclick={() => {
								activeTeamId = team.id;
								betAmount = findBetAmount(team.id);
							}}
						>
							<!-- team name and odds -->
							<div class="col-span-8 flex flex-row items-end justify-between gap-1">
								<span class="truncate text-3xl font-bold">{team.name}</span>
								<span class="px-2 text-xl">x{findTeamOdds(team.id).toFixed(2)}</span>
							</div>
							<!-- bet pool bar -->
							<div class="relative col-span-8 row-start-2 flex items-start justify-center">
								<div
									class="bg-background border-foreground/10 h-5 w-full items-center rounded-full border-2"
								></div>
								<div
									class="bg-accent absolute left-0 top-0 flex h-5 items-center rounded-full px-2 text-start text-sm font-bold"
									style="width: {findTeamPoolPercent(team.id).toFixed(1)}%;"
								>
									{findTeamPoolPercent(team.id).toFixed(1)}%
								</div>
							</div>
							<!-- bet amount -->
							{#key bets}
								<div class="col-span-2 row-span-2 flex items-center justify-center p-2 text-2xl">
									{findBetAmount(team.id)}
								</div>
							{/key}
						</button>
					{/each}
				</div>

				<!-- bet amount input -->
				<form class="mt-8 flex w-full items-center justify-between gap-8 px-4">
					<div class="flex flex-row">
						<Button
							class="bg-secondary size-14 rounded-l-lg text-3xl"
							variant="ghost"
							onclick={() => (betAmount = Math.max(betAmount - 50, 0))}>-</Button
						>
						<Input
							type="number"
							class="hide-arrows border-secondary h-14 w-20 rounded-none border-x-0 border-y-2 p-1 text-center text-2xl"
							placeholder=""
							bind:value={betAmount}
						/>
						<Button
							class="bg-secondary size-14 rounded-r-lg text-3xl"
							variant="ghost"
							onclick={() => (betAmount = Math.max(betAmount + 50, 0))}>+</Button
						>
					</div>
					<Button type="submit" class="h-14 rounded-lg px-4 text-2xl" on:click={() => submitBet()}
						><HandCoins /></Button
					>
				</form>
			</div>
			<Drawer.Footer>
				<!-- small padding at the bottom -->
				<div class="h-16"></div>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
