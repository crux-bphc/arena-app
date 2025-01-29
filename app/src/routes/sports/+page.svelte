<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { EventsSportOptions } from '$lib/types/enums';
	import { type EventsRecord } from '$lib/types/pocketbase';

	import { ListFilter } from 'lucide-svelte';

	let activeSport: string = $state(EventsSportOptions.football);
	let showSidebar = $state(true);
	let showAllSports = $state(false);

	let sports: EventsSportOptions[] = Object.values(EventsSportOptions);
	let events: EventsRecord[] = [];
</script>

<!-- filter button -->
<Button
	variant="secondary"
	size="icon"
	class="mx-4 my-2"
	onclick={() => (showSidebar = !showSidebar)}
>
	<ListFilter class="size-8" />
</Button>

<div class="flex h-screen flex-row gap-2 {showSidebar ? 'pr-3' : 'px-3'}">
	<!-- side bar -->
	<div
		class="hide-scrollbar bg-secondary box-content w-1/3 flex-wrap gap-2 overflow-y-auto p-2 [direction:rtl] {showSidebar
			? 'flex'
			: 'hidden'}"
	>
		<Button
			class="text-md h-14 w-full rounded-xl capitalize"
			variant={showAllSports ? 'default' : 'secondary'}
			onclick={() => (showAllSports = true)}
		>
			All sports
		</Button>
		{#each sports as sport}
			<Button
				class="text-md h-14 w-full rounded-xl capitalize"
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
		class="hide-scrollbar flex flex-wrap gap-2 overflow-y-auto {showSidebar ? 'w-2/3' : 'w-full'}"
	>
		{#each events as event}
			<EventCard isMinimized={showSidebar} {event} />
		{/each}
	</div>
</div>
