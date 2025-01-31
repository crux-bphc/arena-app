<style>
	/* Disable scrollbars being visible */
	.button-container {
		-ms-overflow-style: none;
    	scrollbar-width: none;
		overflow: -moz-scrollbars-none;
	}

	.button-container::-webkit-scrollbar {
		display: none;
	}
</style>

<script lang="ts">
	import Calendar from '$lib/components/Calendar.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { EventsRecord, IsoDateString } from '$lib/types/pocketbase';
	import { getDate } from '$lib/utils';
	import { onMount } from 'svelte';

	// For the loading spinner
	let loaded = $state(false);

	// Stores all the events available
	let fullEvents: EventsRecord[] = [];

	let startDate = new Date(Date.now());
	let currentDay = 0;
	
	let days = $state(0);

	let events: EventsRecord[] = $state([]);
	let sports: string[] = $state([]);

	// Stores the currently active set of filters
	let active: { days: boolean, sports: boolean } = $state({
		sports: true,
		days: false,
	});

	// Filter storage
	let filters: { days: boolean[], sports: Object } = $state({
		days: [],
		sports: {}
	});

	// Checks if a day matches another
	const dayMatches = 
		(dayA: Date, dayB: Date) => 
			dayA.getDate() == dayB.getDate() && dayA.getMonth() == dayB.getMonth() && dayA.getFullYear() == dayB.getFullYear();

	// Gets the day of the event
	const getEventDay = (eventDateString: IsoDateString) => {
		let day = 0;
		let curr = new Date(startDate);
		while (days > day) {
			day += 1;
			if (dayMatches(getDate(eventDateString), curr))
				return day;
			curr.setDate(curr.getDate() + 1);
		}
		return -1;
	}

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
	}

	const updateDayRange = (minTime: number, maxTime: number) => { 
		let curr = new Date(minTime);
		startDate = new Date(minTime);
		let now = new Date(Date.now());
		while (true) {
			days += 1;
			filters.days.push(false);
			if (dayMatches(now, curr))
				currentDay = days;
			if (dayMatches(curr, new Date(maxTime)))
				break;
			curr.setDate(curr.getDate() + 1);
		}
	}

	// Pupulate the calendar and calculate days and filters
    const getEvents = async () => {
		let json = null;
		try {
			const res = await fetch('/api/events');
			json = await res.json();
		} catch (error) {
			console.error('Failed to load calendar', error);
			// Return to show the user nothing but a loader indefinitely
			return;
		}

		fullEvents = json.events;
		events = fullEvents;
		
		// Find start and end dates of all events and apply sports filters
		let [minTime, maxTime] = updateEventData();

		// Find the number of days and the day we are currently at
		updateDayRange(minTime, maxTime);
		
		// If it is zero, then the user likely not is not in the date of the events
		// OR something is wrong.
		if (currentDay == 0) currentDay = days;

		// Enable only the current day
		filters.days[currentDay - 1] = true;

		applyFilters();

		loaded = true;
	}

	onMount(getEvents);
	
	// Apply date and sport filters
	const applyFilters = () => {
		events = fullEvents.filter((value: { startTime: IsoDateString, sport: string }) =>
			filters.sports[value.sport as keyof typeof filters.sports] && 
			filters.days[getEventDay(value.startTime) - 1]
		);
	}
 
	const clickSwitch = (button: string) => {
		// Swap the state of the clicked button, and make every other button off
		for (let key of Object.keys(active))
			active[key as keyof typeof active] = (key == button) && !active[button as keyof typeof active];
	}

	// reset filters to load state
	const resetFilters = () => {
		for (let i = 0; i < filters.days.length; i += 1)
			filters.days[i] = (i == currentDay - 1);
		for (let sport of sports)
			filters.sports[sport] = true;
		applyFilters();
	}

	// When a filter button is clicked, add it to the filter list
	const filterClick = (entry: string | number, days: boolean) => {
		if (days) {
			for (let i = 0; i < filters.days.length; i += 1)
				filters.days[i] = i == entry;
		} else
			filters.sports[entry] = !filters.sports[entry];
		applyFilters();
	}

</script>
<h1 class="m-6 text-center text-3xl font-bold">Calendar</h1>
{#if loaded}
	<div class="button-container m-1 flex overflow-auto justify-center">
		<span>
			<Button variant="calendar" width="short" onclick={() => clickSwitch('sports')} id="sports" class="transition-all duration-100 font-alata m-1 {active.sports ? 'active text-black' : ''}">SPORTS</Button>
			<Button variant="calendar" width="short" onclick={() => clickSwitch('days')} id="days" class="transition-all duration-100 font-alata m-1 {active.days ? 'active text-black' : ''}">DAYS</Button>
		</span>
	</div>
	<div class="button-container m-1 flex overflow-auto">
		{#if active.sports || active.days}
			<Button variant="calendar" width="short" onclick={resetFilters} class="font-alata m-1">RESET</Button>
		{/if}
		{#if active.sports}
			{#each sports as sport}
				<Button variant="calendar" width="long" onclick={() => filterClick(sport, false)} class="transition-all duration-100 font-alata m-1 calendar-filter {filters.sports[sport] ? 'active text-black' : ''}">{sport.toUpperCase()}</Button>
			{/each}
		{:else if active.days}
			{#each { length: days }, i}
				<Button variant="calendar" width="short" onclick={() => filterClick(i, true)} class="transition-all duration-100 font-alata m-1 calendar-filter {filters.days[i] ? 'active text-black' : ''}">DAY {i + 1}</Button>
			{/each}
		{/if}
	</div>
	{#key events}
		<Calendar events={events} />
	{/key}
{:else}
	<Loader />
{/if}
