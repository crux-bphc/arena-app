<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_PB_URL } from '$env/static/public';
	import BetCard from '$lib/components/BetCard.svelte';
	import EventCard from '$lib/components/EventCard.svelte';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import type { EventRecWithStandAndBet } from '$lib/types/expand.js';
	import type { BetsResponse, EventsResponse } from '$lib/types/pocketbase.js';
	import { LogOut } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let currentBets: BetsResponse[] = $state([]);
	let currentBetEvents: EventRecWithStandAndBet[] = $state([]);

	const getBets = async () => {
		try {
			let response = await fetch(`api/user/bets?open=true`);
			let json = await response.json();
			if (!response.ok) {
				throw new Error('message' in json ? json.message : `API returned ${response.status}`);
			}
			currentBets = json.bets;

			const arr = await Promise.all(
				currentBets.map(async (bet) => {
					response = await fetch(`api/event/${bet.event}`);
					json = await response.json();
					if (!response.ok) {
						throw new Error('message' in json ? json.message : `API returned ${response.status}`);
					}
					const event = json;

					response = await fetch(`api/event/${bet.event}/standings`);
					json = await response.json();
					if (!response.ok) {
						throw new Error('message' in json ? json.message : `API returned ${response.status}`);
					}

					event.standings = json.standings;
					event.teams = event.expand.teams;
					delete event.expand;
					return event;
				})
			);
			// remove duplicates by id 
			currentBetEvents = [...new Map(arr.map((item) => [item['id'], item])).values()];
			console.log('currentBetEvents', currentBetEvents);
		} catch (e) {
			console.error(`Failed to fetch current predictions: ${e}`);
			toast.error('Failed to fetch current predictions!');
		}
	};

	onMount(() => {
		getBets();
	});
</script>

<div class="flex flex-col items-center gap-4 p-4">
	<div class="flex w-screen flex-row items-center justify-between px-3">
		<Avatar class="w-21 h-21">
			<AvatarImage
				src={`${PUBLIC_PB_URL}/api/files/users/${data.user?.id}/${data.user?.avatar}`}
				alt="Avatar"
			/>
			<AvatarFallback>{data.user?.name?.at(0) || 'X'}</AvatarFallback>
		</Avatar>
		<div class="max-w flex flex-col gap-1">
			<div class="flex flex-row items-center gap-2">
				<p class="max-w-56 truncate text-xl">{data.user?.name}</p>
				<form method="POST" action="?/logout" use:enhance>
					<Button class="mt-0.5 p-0" variant="outline" type="submit"><LogOut size={16} /></Button>
				</form>
			</div>
			<p class="text-sm text-gray-300">{data.user?.email}</p>
			<div class="bg-primary mt-2 w-fit rounded-lg px-6 py-2 text-sm font-bold text-black">
				{data.user?.balance} COINS
			</div>
		</div>
	</div>
	<Separator class="mt-2" />
	<div class="flex w-screen flex-col gap-4 px-4">
		<p class="text-lg font-bold">CURRENT PREDICTIONS</p>
		{#each currentBetEvents as event}
			{#if event}
				<BetCard {event} {currentBets}/>
			{/if}
		{/each}
	</div>
</div>
