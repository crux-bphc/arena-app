<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { ListFilter } from 'lucide-svelte';

	let activeSport = $state('football');
	let showFilter = $state(true);

	let sports = [
		'all sports',
		'football',
		'skating',
		'squash',
		'table tennis',
		'pool',
		'hockey',
		'chess',
		'tennis',
		'cricket',
		'athletics',
		'powerlifting',
		'swimming',
		'carrom',
		'throwball',
		'kabbadi',
		'badminton',
		'snooker',
		'volleyball',
		'ultimate frisbee'
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
