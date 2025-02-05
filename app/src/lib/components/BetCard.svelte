<script lang="ts">
	import type { EventRecWithStandAndBet, StandingsRecordWithTeam } from '$lib/types/expand';
	import type { BetsResponse } from '$lib/types/pocketbase';
	import { formatTime, getStatus, getTimeLeft } from '$lib/util/helpers';

	interface BetCardProps {
		event: EventRecWithStandAndBet;
		bets: BetsResponse[];
		current?: boolean;
	}

	let { event, bets, current = false }: BetCardProps = $props();
	let status: 'finished' | 'ongoing' | 'starting soon' | 'default' = $state(getStatus(event));

	const filteredBets = bets.filter((bet) => bet.event === event.id);

	const isMinimized = false;

	const teamNameMap: { [key: string]: string } = {};
	event.teams.forEach((team) => {
		teamNameMap[team.id] = team.name;
	});

	// calculates which color should a team have based on won/lost/ongoing etc
	function calcColor(standing?: StandingsRecordWithTeam) {
		if (status == 'ongoing') return 'text-warning';
		else if (status == 'finished') {
			return standing?.position === 1 ? 'text-primary' : 'text-foreground/50';
		}
		return '';
	}
</script>

<div
	class="bg-secondary flex w-full scroll-mt-24 flex-col items-center justify-between gap-2 {isMinimized
		? 'rounded-lg p-2'
		: 'rounded-[10px] p-3'}"
>
	<!-- status & title text -->
	<div
		class="text-foreground/50 line-clamp-1 w-full text-start {isMinimized
			? 'text-sm'
			: 'text-base'}"
	>
		<span class="uppercase">
			{#if status == 'default'}
				starts at {formatTime(event.startTime)}
			{:else if status == 'starting soon'}
				starts in {getTimeLeft(event.startTime)}
			{:else}{status}{/if}
		</span>
		{' - '}
		<span class="capitalize">
			{event.title}
		</span>
	</div>

	<!-- teams & scoreboard -->
	<div class="flex w-full flex-col">
		{#if status == 'default' || status == 'starting soon' || (status == 'ongoing' && !event.standings)}
			<!-- shows teams if event is yet to start or if ongoing event has no standings-->
			<div class="w-full text-start font-bold {isMinimized ? 'text-2xl' : 'text-3xl'}">
				<span class="truncate uppercase">{event.teams.at(0)?.name} {' '}</span>
				<span class="text-xl">vs {' '}</span>
				<span class="truncate uppercase">{event.teams.at(1)?.name} {' '}</span>

				<!-- extra teams indicator -->
				{#if event.teams.length > 2}
					<span class="text-foreground/50 text-xs font-normal"
						>(+{event.teams.length - 2} more)</span
					>
				{/if}
			</div>
		{:else if event.standings}
			<!-- shows standings if event is ongoing or ended -->
			<div
				class="flex w-full flex-row items-center justify-between font-bold {calcColor(
					event.standings.at(0)
				)} {isMinimized ? 'text-2xl' : 'text-3xl'}"
			>
				<div class="uppercase">{teamNameMap[String(event.standings.at(0)?.team)]}</div>
				<div class="">{event?.standings.at(0)?.score}</div>
			</div>
			<div
				class="flex w-full flex-row items-center justify-between font-bold {calcColor(
					event.standings.at(1)
				)} {isMinimized ? 'text-2xl' : 'text-3xl'}"
			>
				<div class="uppercase">{teamNameMap[String(event.standings.at(1)?.team)]}</div>
				<div class="">{event.standings.at(1)?.score}</div>
			</div>

			<!-- extra standings indicator -->
			{#if event.standings.length > 2}
				<span class="text-foreground/50 text-xs">(+{event.standings.length - 2} more)</span>
			{/if}
		{:else}
			<span class="text-foreground/50 capitalize italic">data unavailable</span>
		{/if}
	</div>

	<!-- location text -->
	{#if status == 'default' || status == 'starting soon'}
		<div class="flex w-full items-end justify-between {isMinimized ? 'text-sm' : 'text-base'}">
			<span class="text-foreground/50 mr-1 overflow-hidden truncate text-ellipsis capitalize">
				{`${event.sport.toString()} - `}{event.location}
			</span>
		</div>
	{:else}
		<div
			class="text-foreground/50 mr-1 w-full overflow-hidden truncate text-ellipsis text-start capitalize {isMinimized
				? 'text-sm'
				: 'text-base'}"
		>
			{`${event.sport.toString()} - `}{event.location}
		</div>
	{/if}

	{#if current}
		{#each filteredBets as bet}
			<div
				class="mr-1 w-full overflow-hidden truncate text-ellipsis text-start font-semibold italic text-[#FFDA46] {isMinimized
					? 'text-sm'
					: 'text-base'}"
			>
				You've put {bet.amount} points on {teamNameMap[bet.team]}
			</div>
		{/each}
	{:else}
		{#each filteredBets as bet}
			<div
				class="mr-1 w-full overflow-hidden truncate text-ellipsis text-start font-semibold italic {isMinimized
					? 'text-sm'
					: 'text-base'} {bet.payout >= bet.amount ? 'text-[#91DE43]' : 'text-[#FF5050]'}"
			>
				{bet.payout >= bet.amount ? 'Won' : 'Lost'}
				{bet.payout - bet.amount} points on {teamNameMap[bet.team]}
			</div>
		{/each}
	{/if}
</div>
