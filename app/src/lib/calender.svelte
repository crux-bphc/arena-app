<script>
	// calender starts at {startTime} AM
	let { startTime = 6 } = $props();

	let rows = $state(12 + 12 - startTime);
	let cols = $state(3);
</script>

<div class="flex w-full flex-row bg-slate-900 p-2 text-white">
	<!-- Time stamps -->
	<div class="flex w-12 flex-col text-sm">
		{#each { length: rows }, i}
			<div class="h-20 pr-1 text-right">
				{((i + startTime - 1) % 12) + 1}
				{i < 12 - startTime ? 'AM' : 'PM'}
			</div>
		{/each}
		<div class="text-center">12 AM</div>
	</div>

	<!-- background grid -->
	<div class="grid-cols-{cols} grid-rows-{rows} grid w-[calc(100%-3rem)] py-3">
		{#each { length: rows * cols }, i}
			<div
				class={'h-20 border-t-[1px] border-white/50' +
					' ' +
					(rows * cols - i <= cols && 'border-b-[1px]') +
					' ' +
					(i % cols !== 0 && 'border-l-[1px]')}
			></div>
		{/each}
	</div>
</div>
