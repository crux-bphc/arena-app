<script lang="ts">
	import { onMount } from 'svelte';
	import CalenderItem from '$lib/components/calender-item.svelte';

	interface eventData {
		title: string;
		sport: string;
		startTime: string;
		endTime: string;
		location: string;
	}
	interface eventDataWithPos extends eventData {
		colStart: number;
		rowStart: number;
		rowSpan: number;
	}

	// calender starts at {calenderStartHour} AM
	let { events, calenderStartHour = 6 }: { calenderStartHour?: number; events: eventData[] } =
		$props();

	// removing {calenderStartHour} hours from total day of 24 hours
	let rows = 24 - calenderStartHour;
	let cols = $state(1);
	let eventsWithPos: eventDataWithPos[] = $state([]);
	let occupiedGrids: number[][] = [[]];

	onMount(() => {
		eventsWithPos = events.map((event) => {
			return { ...event, ...calculatePos(event) };
		});

		cols = occupiedGrids.length;
	});

	// returns the position of a specific event on the event grid
	function calculatePos(event: eventData) {
		let startRow = getRow(new Date(event.startTime));
		let endRow = getRow(new Date(event.endTime));

		// finding column with no clashes
		let col = -1;
		for (let i = 0; i < occupiedGrids.length; i++) {
			if (!isAnyNumberInRange(startRow, endRow - 1, occupiedGrids[i])) {
				col = i;
				break;
			}
		}
		if (col === -1) {
			col = occupiedGrids.length;
			occupiedGrids.push([]);
		}
		occupiedGrids[col].push(...Array.from({ length: endRow - startRow }, (_, i) => startRow + i));

		return {
			colStart: col + 1,
			rowStart: startRow,
			rowSpan: endRow - startRow
		};
	}
	// converts hours and mins to its corresponding row
	function getRow(date: Date) {
		return (date.getUTCHours() - calenderStartHour) * 4 + 1 + date.getUTCMinutes() / 15;
	}
	// finds if any number between x & y (inclusive) is in arr
	function isAnyNumberInRange(x: number, y: number, arr: number[]) {
		return arr.some((num) => num >= x && num <= y);
	}
</script>

<div class="flex flex-row bg-transparent p-2 text-white">
	<!-- Time stamps -->
	<div class="flex flex-col text-xs">
		{#each { length: rows }, i}
			<div class="h-20 w-10 pr-1 text-right">
				{((i + calenderStartHour - 1) % 12) + 1}
				{i < 12 - calenderStartHour ? 'AM' : 'PM'}
			</div>
		{/each}
		<div class="text-center">12 AM</div>
	</div>

	<div class="relative my-2 overflow-x-scroll" style="width:{cols <= 2 && '100%'};">
		<!-- background grid -->
		<div
			class="grid"
			style="grid-template-columns: repeat({cols}, minmax(0, 1fr)); 
                grid-template-rows: repeat({rows}, minmax(0, 1fr));
				width: {cols <= 2 ? '100%' : String(cols * 7.5) + 'rem'}"
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
                grid-template-rows: repeat({rows * 4}, minmax(0, 1fr));
				width: {cols <= 2 ? '100%' : String(cols * 7.5) + 'rem'}"
		>
			{#each eventsWithPos as event}
				<CalenderItem {...event} />
			{/each}
		</div>
	</div>
</div>
