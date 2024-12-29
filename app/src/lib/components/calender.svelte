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

	// calender starts at {startTime} AM
	let { events, calStartTime = 6 }: { calStartTime?: number; events: eventData[] } = $props();

	let rows = $state(12 + 12 - calStartTime);
	let cols = $state(1);
	let eventsWithPos: eventDataWithPos[] | null = $state(null);

	onMount(() => {
		let occupiedGrids: number[][] = [[]];

		let newEventData: eventDataWithPos[] = events.map((event) => {
			let data = calculatePos(event, occupiedGrids);
			occupiedGrids = data.occupiedGrids;
			return { ...event, ...data.pos };
		});

		cols = occupiedGrids.length;
		eventsWithPos = newEventData;
	});

	// returns the position of a specific event on the event grid
	function calculatePos(event: eventData, occupiedGrids: number[][]) {
		let startRow = getRow(new Date(event.startTime));
		let endRow = getRow(new Date(event.endTime));
		let newOccupiedGrids = [...occupiedGrids];

		// finding column with no clashes
		let col = -1;
		for (let i = 0; i < newOccupiedGrids.length; i++) {
			if (!isAnyNumberInRange(startRow, endRow - 1, newOccupiedGrids[i])) {
				col = i;
				break;
			}
		}
		if (col === -1) {
			col = newOccupiedGrids.length;
			newOccupiedGrids.push([]);
		}
		newOccupiedGrids[col].push(
			...Array.from({ length: endRow - startRow }, (_, i) => startRow + i)
		);

		return {
			pos: {
				colStart: col + 1,
				rowStart: startRow,
				rowSpan: endRow - startRow
			},
			occupiedGrids: newOccupiedGrids
		};
	}
	// converts hours and mins to its corresponding row
	function getRow(date: Date) {
		return (date.getUTCHours() - calStartTime) * 4 + 1 + date.getUTCMinutes() / 15;
	}
	// finds if any number between x & y (inclusive) is in arr
	function isAnyNumberInRange(x: number, y: number, arr: number[]) {
		const set = new Set(arr);
		for (let i = x; i <= y; i++) {
			if (set.has(i)) return true;
		}
		return false;
	}
</script>

<div class="flex flex-row bg-transparent p-2 text-white">
	<!-- Time stamps -->
	<div class="flex flex-col text-xs">
		{#each { length: rows }, i}
			<div class="h-20 w-10 pr-1 text-right">
				{((i + calStartTime - 1) % 12) + 1}
				{i < 12 - calStartTime ? 'AM' : 'PM'}
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
			{#each eventsWithPos ?? [] as event, i}
				<CalenderItem {...event} />
			{/each}
		</div>
	</div>
</div>
