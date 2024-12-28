<script>
	import CalenderItem from './calender-item.svelte';

	// calender starts at {startTime} AM
	let { startTime = 6 } = $props();

	let rows = $state(12 + 12 - startTime);
	let cols = $state(3);
</script>

<div class="flex w-full flex-row bg-slate-900 p-2 text-white">
	<!-- Time stamps -->
	<div class="flex w-10 flex-col text-xs">
		{#each { length: rows }, i}
			<div class="h-20 pr-1 text-right">
				{((i + startTime - 1) % 12) + 1}
				{i < 12 - startTime ? 'AM' : 'PM'}
			</div>
		{/each}
		<div class="text-center">12 AM</div>
	</div>

	<div class="relative my-2 w-[calc(100%-2.5rem)]">
		<!-- background grid -->
		<div
			class="grid"
			style="grid-template-columns: repeat({cols}, minmax(0, 1fr)); 
                grid-template-rows: repeat({rows}, minmax(0, 1fr))"
		>
			{#each { length: rows * cols }, i}
				<div
					class="h-20 border-t-[1px] border-white/50
                        {rows * cols - i <= cols && 'border-b-[1px]'}
                        {i % cols !== 0 && 'border-l-[1px]'}"
				></div>
			{/each}
		</div>

		<!-- event card grid -->
		<div
			class="absolute inset-0 grid h-full"
			style="grid-template-columns: repeat({cols}, minmax(0, 1fr)); 
                grid-template-rows: repeat({rows * 4}, minmax(0, 1fr))"
		></div>
	</div>
</div>
