<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { EventsSportOptions } from '$lib/types/enums';
	import type { EventRecWithStandAndBet } from '$lib/types/expand';
	import { getStatus } from '$lib/util/helpers';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	import { ListFilter } from 'lucide-svelte';

	const { data }: { data: PageData } = $props();

	let activeSport: string = $state(EventsSportOptions.football);
	let showSidebar = $state(true);
	let showAllSports = $state(true);
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
		if (data.url.searchParams.get('eventId'))
			document.getElementById('defaultScrollTarget')?.click();
		else document.getElementById('allSportsBtn')?.click();
	});
</script>

<!-- filter button -->
<Button variant="secondary" size="icon" class="m-3" onclick={() => (showSidebar = !showSidebar)}>
	<ListFilter class="size-8" />
</Button>

<div class="flex h-[90vh] flex-row gap-2 {showSidebar ? 'pr-3' : 'px-3'}">
	<!-- side bar -->
	<div
		class="hide-scrollbar bg-secondary box-content w-1/3 flex-wrap gap-2 overflow-y-auto p-2 [direction:rtl] {showSidebar
			? 'flex'
			: 'hidden'}"
	>
		<!-- this is a hidden tag whose sole purpose is to go to event specified in [eventId] -->
		<!-- gets automatically clicked on load -->
		<a
			href="#{data.url.searchParams.get('eventId')}"
			id="defaultScrollTarget"
			aria-label="none"
			class="hidden"
		></a>
		<Button
			id="allSportsBtn"
			href="#{getFirstOngoingEvent(null) ?? '_'}"
			class="h-14 w-full rounded-xl text-base capitalize"
			variant={showAllSports ? 'default' : 'secondary'}
			onclick={() => (showAllSports = true)}
		>
			All sports
		</Button>
		{#each sports as sport}
			<Button
				href="#{getFirstOngoingEvent(sport) ?? '_'}"
				class="h-14 w-full rounded-xl text-base capitalize"
				variant={!showAllSports && activeSport === sport ? 'default' : 'secondary'}
				onclick={() => {
					activeSport = sport;
					showAllSports = false;
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
		<!-- <EventCard isMinimized={showSidebar} event={events[0]} /> -->
		{#each events as event}
			{#if event.sport === activeSport || showAllSports}
				<EventCard id={event.id} isMinimized={showSidebar} {event} userBets={data.bets} {balance} />
			{/if}
		{/each}
	</div>
</div>
