<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { EventsSportOptions } from '$lib/types/enums';
	import type { EventRecWithStandAndBet } from '$lib/types/expand';
	import { getStatus } from '$lib/util/helpers';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	import { Bird, Filter, FilterX } from 'lucide-svelte';

	const { data }: { data: PageData } = $props();
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let activeSport: string = $state(page.url.searchParams.get('sport') ?? '');
	let showSidebar = $state(true);
	let showAllSports = $state(
		!Object.values(EventsSportOptions).includes(
			(page.url.searchParams.get('sport') ?? '') as EventsSportOptions
		)
	);
	let events: EventRecWithStandAndBet[] = $state(data.events);
	let balance: number = $state(data.balance);

	let sports: EventsSportOptions[] = Object.values(EventsSportOptions);

	// gets the first ongoing event in a sport or all sports (if sports = null)
	function getFirstOngoingEvent(sport: string | null) {
		if (sport != null)
			return (
				events.find((event) => {
					return event.sport.toString() === sport && getStatus(event) === 'ongoing';
				})?.id ?? null
			);
		else return events.find((event) => getStatus(event) === 'ongoing')?.id ?? null;
	}

	// this is to auto scroll to either event given in search param [eventId] in all sports or topmost ongoing event in all sports
	onMount(() => {
		if (balance == null) return;
		if (page.url.searchParams.get('eventId'))
			document.getElementById('defaultScrollTarget')?.click();
		else if (!showAllSports) {
			document.getElementById(`${activeSport.toString()}Btn`)?.click();
		} else document.getElementById('allSportsBtn')?.click();
	});
</script>

<!-- filter button -->
<Button
	variant="accent"
	size="icon"
	class="fixed right-0 top-0 z-10 m-3"
	onclick={() => (showSidebar = !showSidebar)}
>
	{#if showSidebar}
		<FilterX class="size-8" />
	{:else}
		<Filter class="size-8" />
	{/if}
</Button>

<div class="flex h-[95vh] flex-row gap-2 {showSidebar ? 'pr-3' : 'px-3'}">
	<!-- side bar -->
	<div
		class="hide-scrollbar bg-secondary box-content w-1/3 flex-wrap gap-2 overflow-y-auto p-2 [direction:rtl] {showSidebar
			? 'flex'
			: 'hidden'}"
	>
		<!-- this is a hidden tag whose sole purpose is to go to event specified in [eventId] -->
		<!-- gets automatically clicked on load -->
		<a
			href="#{page.url.searchParams.get('eventId') ?? ''}"
			id="defaultScrollTarget"
			aria-label="none"
			class="hidden"
		></a>
		<Button
			id="allSportsBtn"
			href="#{getFirstOngoingEvent(null) ?? '_'}"
			class="h-14 w-full rounded-xl text-base uppercase"
			variant={showAllSports ? 'default' : 'secondary'}
			onclick={() => {
				showAllSports = true;
			}}
		>
			All sports
		</Button>
		{#each sports as sport}
			<Button
				href="#{getFirstOngoingEvent(sport) ?? '_'}"
				id="{sport.toString()}Btn"
				class="h-14 w-full rounded-xl text-base uppercase"
				variant={!showAllSports && activeSport === sport ? 'default' : 'secondary'}
				onclick={() => {
					activeSport = sport;
					showAllSports = false;
					goto(`?sport=${sport}`);
				}}
			>
				{sport}
			</Button>
		{/each}
	</div>

	<!-- event cards -->
	<div
		class="hide-scrollbar flex flex-col items-start justify-start gap-2 overflow-y-auto {showSidebar
			? 'w-2/3'
			: 'w-full'}"
	>
		<div
			class="text-primary flex w-full items-center py-6 text-2xl font-bold {showSidebar
				? 'justify-start px-8'
				: 'justify-center'}"
		>
			<div class="uppercase">{showAllSports ? 'All Sports' : activeSport}</div>
		</div>
		<!-- <EventCard isMinimized={showSidebar} event={events[0]} /> -->
		{#each events as event}
			{#if event.sport === activeSport || showAllSports}
				<EventCard
					id={event.id}
					isMinimized={showSidebar}
					{event}
					userBets={data.bets}
					{balance}
					isHighlight={page.url.searchParams.get('eventId') === event.id}
					showSport={showAllSports}
				/>
			{/if}
		{/each}
		{#if events.filter((e) => showAllSports || e.sport === activeSport).length === 0}
			<div class="flex w-full select-none flex-col items-center gap-5">
				<Bird color="#77767b" size={144} />
				<div class="font-alata m-1 text-center">It looks like there are no events yet!</div>
			</div>
		{/if}
	</div>
</div>
