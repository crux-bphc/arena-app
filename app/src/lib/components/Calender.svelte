<script lang="ts">
	import { onMount } from 'svelte';
	import CalenderItem from '$lib/components/CalenderItem.svelte';

	interface EventData {
		title: string;
		sport: string;
		startTime: string;
		endTime: string;
		location: string;
	}
	interface EventDataWithPos extends EventData {
		colStart: number;
		rowStart: number;
		rowSpan: number;
	}

	// calender is between {calenderStartHour}th hour and {calenderEndHour}th hour
	let {
		events,
		calenderStartHour = 6,
		calenderEndHour = 24
	}: { calenderStartHour?: number; calenderEndHour?: number; events: EventData[] } = $props();

	// removing {calenderStartHour} hours from total day of 24 hours
	let rows = calenderEndHour - calenderStartHour;
	let cols = $state(1);
	let eventsWithPos: EventDataWithPos[] = $state([]);
	let occupiedGrids: number[][] = [[]];

	onMount(() => {
		eventsWithPos = events.map((event) => {
			return { ...event, ...calculatePos(event) };
		});
		cols = occupiedGrids.length;
	});

	// returns the position of a specific event on the event grid
	function calculatePos(event: EventData) {
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

<div class="flex flex-row bg-transparent px-1 py-2 text-white">
	<!-- Time stamps -->
	<div class="flex flex-col text-xs font-semibold">
		{#each { length: rows }, i}
			<div class="h-20 w-10 pr-1">
				{((i + calenderStartHour - 1) % 12) + 1}
				{i < 12 - calenderStartHour ? 'AM' : 'PM'}
			</div>
		{/each}
		<div class="w-10 pr-1">
			{((calenderEndHour - 1) % 12) + 1}
			{calenderEndHour % 24 >= 12 ? 'PM' : 'AM'}
		</div>
	</div>

	<div class="relative my-2 overflow-x-scroll {cols <= 2 ? 'w-full' : ''}">
		<!-- background grid -->
		<div
			class="grid"
			style="grid-template-columns: repeat({cols}, minmax(0, 1fr)); 
                grid-template-rows: repeat({rows}, minmax(0, 1fr));
				width: {cols <= 2 ? '100%' : `calc(${100 * cols / 3}vw - 7.5rem)`}"
		>
			{#each { length: rows * cols }, i}
				<div
					class="h-20 border-t-[1px] border-white/20
                        {i >= (rows - 1) * cols ? 'border-b-[1px]' : ''}
                        {i % cols !== 0 ? 'border-l-[1px]': ''}"
				></div>
			{/each}
		</div>

		<!-- event card grid -->
		<div
			class="absolute inset-0 grid h-full"
			style="grid-template-columns: repeat({cols}, minmax(0, 1fr)); 
                grid-template-rows: repeat({rows * 4}, minmax(0, 1fr));
				width: {cols <= 2 ? '100%' : `calc(${100 * cols / 3}vw - 7.5rem)`}"
		>
			{#each eventsWithPos as event}
				<CalenderItem {...event} />
			{/each}
		</div>
	</div>
</div>
