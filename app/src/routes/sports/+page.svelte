<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { EventsSportOptions } from '$lib/types/enums';
	import { type EventsRecord } from '$lib/types/pocketbase';

	import { ListFilter } from 'lucide-svelte';

	let activeSport = $state('football');
	let showFilter = $state(true);

	let sports: EventsSportOptions[] = Object.values(EventsSportOptions);
	let events: EventsRecord[] = [
		{
			banner: '',
			created: '2025-01-28 17:16:45.944Z',
			description: 'test',
			endTime: '2025-01-31 12:00:00.000Z',
			id: 'so9o0ig2dn44r81',
			location: 'here',
			sport: EventsSportOptions['football'],
			standingsUpdated: false,
			startTime: '2025-01-01 12:00:00.000Z',
			teams: ['8j2p6rabfu3z9uj', 'qxwt6525j8p6616'],
			title: 'event1',
			updated: '2025-01-28 17:16:45.944Z'
		}
	];
</script>

<Button variant="outline" size="icon" class="mx-4 my-2" onclick={() => (showFilter = !showFilter)}>
	<ListFilter class="size-8" />
</Button>
<div class="flex h-screen flex-row gap-2 px-2">
	<div
		class="hide-scrollbar bg-secondary box-content w-1/3 flex-wrap gap-2 overflow-y-auto p-2 [direction:rtl] {showFilter
			? 'flex'
			: 'hidden'}"
	>
		{#each sports as sport}
			<Button
				class="text-md h-14 w-full rounded-xl capitalize"
				variant={activeSport === sport ? 'default' : 'secondary'}
				onclick={() => (activeSport = sport)}
			>
				{sport}
			</Button>
		{/each}
	</div>

</div>
