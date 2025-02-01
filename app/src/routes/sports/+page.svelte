<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { EventsSportOptions } from '$lib/types/enums';
	import type { EventsRecordWithStandings } from '$lib/types/expand';
	import type { PageData } from './$types';

	import { ListFilter } from 'lucide-svelte';

	const { data }: { data: PageData } = $props();

	let activeSport: string = $state(EventsSportOptions.football);
	let showSidebar = $state(true);
	let showAllSports = $state(true);
	let events: EventsRecordWithStandings[] = $state(data.events);

	let sports: EventsSportOptions[] = Object.values(EventsSportOptions);
</script>

<!-- filter button -->
<Button
	variant="secondary"
	size="icon"
	class="m-3"
	onclick={() => (showSidebar = !showSidebar)}
>
	<ListFilter class="size-8" />
</Button>

<div class="flex h-[90vh] flex-row gap-2 {showSidebar ? 'pr-3' : 'px-3'}">
	<!-- side bar -->
	<div
		class="hide-scrollbar bg-secondary box-content w-1/3 flex-wrap gap-2 overflow-y-auto p-2 [direction:rtl] {showSidebar
			? 'flex'
			: 'hidden'}"
	>
		<Button
			class="h-14 w-full rounded-xl text-base capitalize"
			variant={showAllSports ? 'default' : 'secondary'}
			onclick={() => (showAllSports = true)}
		>
			All sports
		</Button>
		{#each sports as sport}
			<Button
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
				<EventCard isMinimized={showSidebar} {event} />
			{/if}
		{/each}
	</div>
</div>
