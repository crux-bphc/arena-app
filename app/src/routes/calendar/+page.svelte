<script lang="ts">
	import Calendar from '$lib/components/Calendar.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import type { EventsRecord, IsoDateString } from '$lib/types/pocketbase';
	import { getDate } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Bird } from 'lucide-svelte';

	// For the loading spinner
	let loaded = $state(false);
	let firstLoad = $state(true);

	let noEvents = $state(false);

	// Stores all the events available
	let fullEvents: EventsRecord[] = [];

	let startDate = new Date(Date.now());
	let currentDay = 0;

	let days = $state(0);

	let events = $state<EventsRecord[]>([]);
	let sports = $state<string[]>([]);

	// Stores the currently active set of filters
	let active = $state<{ days: boolean; sports: boolean }>({
		sports: true,
		days: false
	});

	// Filter storage
	let filters = $state<{ days: boolean[]; sports: { [key: string]: boolean } }>({
		days: [],
		sports: {}
	});

	let selectedDate = $state<Date>(new Date(new Date().setUTCHours(0, 0, 0, 0)));

	// Checks if a day matches another
	const isDateEqual = (dayA: Date, dayB: Date) =>
		dayA.getDate() == dayB.getDate() &&
		dayA.getMonth() == dayB.getMonth() &&
		dayA.getFullYear() == dayB.getFullYear();

	// Gets the day of the event
	const getEventDay = (eventDateString: IsoDateString) => {
		let zeroedStartDate = new Date(startDate);
		// Get the start of the starting date
		zeroedStartDate.setHours(0, 0, 0, 0);

		const difference = getDate(eventDateString).getTime() - zeroedStartDate.getTime();
		const day = Math.ceil(difference / (24 * 60 * 60 * 1000));

		// Can't happen probably
		if (day > days) return -1;

		return day;
	};

	// day is 0-indexed
	const getDateFromDay = (day: number) =>
		new Date(startDate.setUTCHours(0, 0, 0, 0) + day * 24 * 60 * 60 * 1000);

	const updateEventData = (): [number, number] => {
		let minTime = Infinity;
		let maxTime = -Infinity;

		for (let event of events) {
			const dateNum = getDate(event.startTime).getTime();

			if (minTime > dateNum) minTime = dateNum;
			if (maxTime < dateNum) maxTime = dateNum;

			if (!sports.includes(event.sport)) {
				sports.push(event.sport);
				// Enable all sports
				filters.sports[event.sport] = true;
			}
		}
		return [minTime, maxTime];
	};

	const updateDayRange = (minTime: number, maxTime: number) => {
		let curr = new Date(minTime);
		startDate = new Date(minTime);
		const now = new Date(Date.now());
		while (true) {
			days += 1;
			filters.days.push(false);
			if (isDateEqual(now, curr)) currentDay = days;
			if (isDateEqual(curr, new Date(maxTime))) break;
			curr.setDate(curr.getDate() + 1);
		}
	};

	// Pupulate the calendar and calculate days and filters
	const getEvents = async () => {
		let json = null;
		try {
			const res = await fetch('/api/events');
			json = await res.json();

			if (!json?.events || json?.events?.length == 0) {
				noEvents = true;
				return;
			}
		} catch (error) {
			console.error('Failed to load calendar', error);
			toast.error('Failed to load calendar!');
			return;
		}

		events = fullEvents = json.events;

		// Find start and end dates of all events and apply sports filters
		const [minTime, maxTime] = updateEventData();

		// Find the number of days and the day we are currently at
		updateDayRange(minTime, maxTime);

		// If it is zero, then the user likely not is not in the date of the events
		// OR something is wrong.
		if (currentDay == 0) currentDay = days;

		// Enable only the current day
		filters.days[currentDay - 1] = true;
		selectedDate = getDateFromDay(currentDay - 1);

		applyFilters(true);

		loaded = true;
	};

	onMount(() => {
		getEvents();
	});

	// Apply date and sport filters
	const applyFilters = (firstLoadValue = false) => {
		firstLoad = firstLoadValue;
		events = fullEvents.filter(
			(value) => filters.sports[value.sport] && filters.days[getEventDay(value.startTime) - 1]
		);
	};

	const clickSwitch = (button: string) => {
		// Swap the state of the clicked button, and make every other button off
		for (let key of Object.keys(active))
			active[key as keyof typeof active] = key == button && !active[button as keyof typeof active];
	};

	// reset filters to load state
	const resetFilters = () => {
		for (let i = 0; i < filters.days.length; i += 1) filters.days[i] = i == currentDay - 1;
		selectedDate = getDateFromDay(currentDay - 1);
		for (let sport of sports) filters.sports[sport] = true;
		applyFilters();
	};

	// When a filter button is clicked, add it to the filter list
	const filterClick = (entry: string | number, days: boolean) => {
		if (days) {
			selectedDate = getDateFromDay(Number(entry));
			for (let i = 0; i < filters.days.length; i += 1) filters.days[i] = i == entry;
		} else filters.sports[entry] = !filters.sports[entry];
		applyFilters();
	};
</script>

<h1 class="m-6 text-center text-3xl font-bold select-none">Calendar</h1>
{#if loaded}
	<div class="button-container m-1 flex justify-center overflow-auto">
		<span>
			<Button
				variant="calendar"
				width="short"
				onclick={() => clickSwitch('sports')}
				id="sports"
				class="m-1 font-alata transition-all duration-100 {active.sports
					? 'active text-black'
					: ''}">SPORTS</Button
			>
			<Button
				variant="calendar"
				width="short"
				onclick={() => clickSwitch('days')}
				id="days"
				class="m-1 font-alata transition-all duration-100 {active.days ? 'active text-black' : ''}"
				>DAYS</Button
			>
		</span>
	</div>
	<div class="button-container m-1 flex overflow-auto">
		{#if active.sports || active.days}
			<Button variant="calendar" width="short" onclick={resetFilters} class="m-1 font-alata"
				>RESET</Button
			>
		{/if}
		{#if active.sports}
			{#each sports as sport}
				<Button
					variant="calendar"
					width="long"
					onclick={() => filterClick(sport, false)}
					class="calendar-filter m-1 font-alata transition-all duration-100 {filters.sports[sport]
						? 'active text-black'
						: ''}">{sport.toUpperCase()}</Button
				>
			{/each}
		{:else if active.days}
			{#each { length: days }, i}
				<Button
					variant="calendar"
					width="short"
					onclick={() => filterClick(i, true)}
					class="calendar-filter m-1 font-alata transition-all duration-100 {filters.days[i]
						? 'active text-black'
						: ''}">DAY {i + 1}</Button
				>
			{/each}
		{/if}
	</div>
	{#key events}
		<Calendar {events} {firstLoad} {selectedDate} />
	{/key}
{:else if !noEvents}
	<Loader />
{:else}
	<div class="flex flex-col items-center gap-5 select-none">
		<Bird color="#77767b" size={144} />
		<div class="m-1 text-center font-alata">It looks like there are no events yet!</div>
	</div>
{/if}

<style>
	/* Disable scrollbars being visible */
	.button-container {
		-ms-overflow-style: none;
		scrollbar-width: none;
		overflow: -moz-scrollbars-none;
		user-select: none;
	}

	.button-container::-webkit-scrollbar {
		display: none;
	}
</style>
