<!-- this component has 4 states which are automatically set based on current time-->
<!-- finished (after endTime has passed)-->
<!-- ongoing (between startTime & endTime)-->
<!-- starting soon (<3hrs left from startTime) -->
<!-- default/starts at (>3hrs left from startTime) -->

<script lang="ts">
	import type { EventRecWithStandAndBet, StandingsRecordWithTeam } from '$lib/types/expand';
	import type { BetsRecord } from '$lib/types/pocketbase';
	import { formatTime, getStatus, getTimeLeft } from '$lib/util/helpers';
	import BetPopup from '$lib/components/BetPopup.svelte';

	interface EventCardProps {
		isMinimized?: boolean;
		event: EventRecWithStandAndBet;
		userBets: BetsRecord[];
		balance: number;
		id?: string;
	}

	// if isMinimized is true, the whole component scales down
	// (this is for sports page when the side bar opens)
	let { isMinimized = false, event, userBets, balance, id }: EventCardProps = $props();
	let status: 'finished' | 'ongoing' | 'starting soon' | 'default' = $state(getStatus(event));

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
	{id}
	class="bg-secondary flex w-full flex-col items-center justify-between gap-2 {isMinimized
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
				<div class="uppercase">{event.standings.at(0)?.team.name}</div>
				<div class="">{event?.standings.at(0)?.score}</div>
			</div>
			<div
				class="flex w-full flex-row items-center justify-between font-bold {calcColor(
					event.standings.at(1)
				)} {isMinimized ? 'text-2xl' : 'text-3xl'}"
			>
				<div class="uppercase">{event.standings.at(1)?.team.name}</div>
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
			<span class="text-foreground/50 line-clamp-1 capitalize">
				{event.location}
			</span>
			<BetPopup {isMinimized} {event} {userBets} {balance} />
		</div>
	{:else}
		<div
			class="text-foreground/50 line-clamp-1 w-full text-start capitalize {isMinimized
				? 'text-sm'
				: 'text-base'}"
		>
			{event.location}
		</div>
	{/if}
</div>
