<script lang="ts">
	import { onMount } from 'svelte';
	import CalendarItem from '$lib/components/CalendarItem.svelte';

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

	// calendar is between {calendarStartHour}th hour and {calendarEndHour}th hour
	let {
		events,
		calendarStartHour = 6,
		calendarEndHour = 24,
		firstLoad,
		selectedDate
	}: {
		calendarStartHour?: number;
		calendarEndHour?: number;
		events: EventData[];
		firstLoad: boolean;
		selectedDate: Date;
	} = $props();

	// removing {calendarStartHour} hours from total day of 24 hours
	let rows = calendarEndHour - calendarStartHour;
	let cols = $state(1);
	let eventsWithPos: EventDataWithPos[] = $state([]);
	let occupiedGrids: number[][] = [[]];

	let top = $state(0);
	let timeString = $state<string | null>(null);
	let hourHeight = $state<number | null>(null);
	let disabledTimeStamp = $state(-1);
	let width = $state(0);

	// If the time-line is within 13 pixels above or below a timestamp, do not show the timestamp
	// This is an aribtrary constant that seems to cause no visual defects with overlapping times
	const noShowTimeStampHeight = 13;

	onMount(() => {
		eventsWithPos = events.map((event) => {
			return { ...event, ...calculatePos(event) };
		});
		cols = occupiedGrids.length;
		updateTimeLocation();
		if (firstLoad) window.scrollTo({ top });
		// Update the time every ~30 seconds
		setInterval(updateTimeLocation, 1000 * 30);
	});

	const isUTCDateEqual = (dayA: Date, dayB: Date) =>
		dayA.getUTCDate() == dayB.getUTCDate() &&
		dayA.getUTCMonth() == dayB.getUTCMonth() &&
		dayA.getUTCFullYear() == dayB.getUTCFullYear();

	// returns the position of a specific event on the event grid
	function calculatePos(event: EventData) {
		let startTime = new Date(event.startTime);
		let endTime = new Date(event.endTime);

		// round down start time
		startTime.setUTCMinutes(Math.floor(startTime.getUTCMinutes() / 15) * 15);
		// The start time is not on this day, therefore it can be assumed that it's on some previous day
		if (!isUTCDateEqual(startTime, selectedDate)) {
			startTime.setUTCHours(calendarStartHour);
		}

		const startRow = getRow(startTime);

		// clamp end time
		const dayAfterSelectedDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);
		endTime = new Date(Math.min(endTime.getTime(), dayAfterSelectedDate.getTime()));

		// round up end time
		const minutes = Math.ceil(endTime.getUTCMinutes() / 15) * 15;
		const hours = endTime.getUTCHours() + Number(minutes == 60);
		endTime.setUTCHours(hours % 24, minutes % 60);

		// this handles times that were either already aligned or rounded up rn
		const endRow = getRow(endTime, hours == 0 || hours == 24);

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
	function getRow(date: Date, isMidnight = false) {
		return (
			((isMidnight ? 24 : date.getUTCHours()) - calendarStartHour) * 4 +
			1 +
			date.getUTCMinutes() / 15
		);
	}
	// finds if any number between x & y (inclusive) is in arr
	function isAnyNumberInRange(x: number, y: number, arr: number[]) {
		return arr.some((num) => num >= x && num <= y);
	}

	// Utility functions to display the time
	const padZeroes = (number: number) => (number < 10 ? '0' + number.toString() : number.toString());
	const to12Hours = (hours: number) => (hours > 12 ? hours - 12 : hours);
	const timeDesignator = (hours: number) => (hours >= 12 ? 'PM' : 'AM');

	// Update the location of the time display bar
	const updateTimeLocation = () => {
		if (hourHeight == null) return;

		const time = new Date(Date.now());
		const hours = time.getHours();
		const minutes = time.getMinutes();
		if (hours >= calendarStartHour) {
			const hourTop = (hours - (12 - calendarStartHour)) * hourHeight;
			const minuteTop = (hourHeight / 60) * minutes;
			top = hourTop + minuteTop;
			timeString = `${to12Hours(hours)}:${padZeroes(minutes)} ${timeDesignator(hours)}`;

			// The time-line is below the timestamp
			if (top % hourHeight <= noShowTimeStampHeight) disabledTimeStamp = hourTop / hourHeight;
			// The time-line is above the time stamp
			else if (hourHeight - (top % hourHeight) <= noShowTimeStampHeight)
				disabledTimeStamp = hourTop / hourHeight + 1;
			// The time-line is not near a timestamp
			else disabledTimeStamp = -1;
		} else timeString = null;
	};
</script>

<div class="flex flex-row bg-transparent px-1 py-2">
	<!-- Time stamps -->
	<div class="relative flex select-none flex-col text-xs font-semibold">
		{#if timeString}
			<div
				class="time bg-background absolute text-[10px] font-bold text-red-600"
				style="top: {top}px;"
			>
				{timeString}
			</div>
		{/if}
		{#each { length: rows }, i}
			<div
				class="h-20 w-12 pr-1 text-white {i == disabledTimeStamp ? 'invisible' : ''}"
				bind:offsetHeight={hourHeight}
			>
				{((i + calendarStartHour - 1) % 12) + 1}
				{i < 12 - calendarStartHour ? 'AM' : 'PM'}
			</div>
		{/each}
		<div class="w-12 pr-1">
			{((calendarEndHour - 1) % 12) + 1}
			{calendarEndHour % 24 >= 12 ? 'PM' : 'AM'}
		</div>
	</div>

	<div class="relative my-2 overflow-x-scroll {cols <= 2 ? 'w-full' : ''}">
		{#if timeString}
			<div
				class="line absolute z-[1] h-px w-full bg-red-600 before:bg-red-600"
				style="top: {top}px; min-width: {width}px"
			>
				<div
					class="absolute left-0 border-y-4 border-l-8 border-r-0 border-solid border-y-transparent border-l-red-600"
					style="top: -3.5px"
				></div>
			</div>
		{/if}
		<!-- background grid -->
		<div
			class="grid"
			style="grid-template-columns: repeat({cols}, minmax(0, 1fr)); 
                grid-template-rows: repeat({rows}, minmax(0, 1fr));
				width: {cols <= 2 ? '100%' : `calc(${(100 * cols) / 3}vw - 5rem)`}"
			bind:clientWidth={width}
		>
			{#each { length: rows * cols }, i}
				<div
					class="h-20 border-t-[1px] border-white/20
                        {i >= (rows - 1) * cols ? 'border-b-[1px]' : ''}
                        {i % cols !== 0 ? 'border-l-[1px]' : ''}"
				></div>
			{/each}
		</div>

		<!-- event card grid -->
		<div
			class="absolute inset-0 grid h-full"
			style="grid-template-columns: repeat({cols}, minmax(0, 1fr)); 
                grid-template-rows: repeat({rows * 4}, minmax(0, 1fr));
				width: {cols <= 2 ? '100%' : `calc(${(100 * cols) / 3}vw - 5rem)`}"
		>
			{#each eventsWithPos as event}
				<CalendarItem {...event} />
			{/each}
		</div>
	</div>
</div>

<style>
	/* Disable scrollbars being visible */
	div {
		-ms-overflow-style: none;
		scrollbar-width: none;
		overflow: -moz-scrollbars-none;
		user-select: none;
	}

	div::-webkit-scrollbar {
		display: none;
	}
</style>
