<script lang="ts">
	import { PUBLIC_PB_URL } from '$env/static/public';

	import { onMount } from 'svelte';

	import type { EventsRecord } from '$lib/types/pocketbase';

	import Loader from '$lib/components/Loader.svelte';
	import Banner from '$lib/components/Banner.svelte';

	import { defaultImages } from '$lib/utils/defaultImages.js';
	import { Bird } from 'lucide-svelte';

	interface EventsData {
		events: EventsRecord[];
	}
	onMount(() => {
		getEventsData();
		loaded = true;
	});

	let loaded = $state(false);
	let events = $state<EventsData | null>(null);
	let otherEvents = $state<EventsRecord[] | null>(null);
	let mainEvent = $state<EventsRecord | null>(null);

	async function getEventsData() {
		try {
			const response = await fetch('/api/events?pool=true');
			if (!response.ok) {
				console.error(`Failed to fetch leaderboard data: ${response.status}`);
				return;
			}
			events = await response.json();
			if (events) {
				mainEvent = events['events'][0];
				otherEvents = events['events'].slice(1, 3);
			}
		} catch (e) {
			console.error(`Failed to fetch leaderboard data: ${e}`);
		}
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		const day = date.getDate();
		const suffix =
			day % 10 === 1 && day !== 11
				? 'st'
				: day % 10 === 2 && day !== 12
					? 'nd'
					: day % 10 === 3 && day !== 13
						? 'rd'
						: 'th';
		const formattedDate = `${day}${suffix} ${date.toLocaleString('en-US', { month: 'long', hour: 'numeric', minute: 'numeric', hour12: true }).replace(' at ', ', ')}`;
		return formattedDate;
	}

	function formatDateCountdown(dateString: string) {
		const date = new Date(dateString);
		const now = new Date();
		const min = Math.floor((date.getTime() - now.getTime()) / 60000);
		if (min < 0) {
			return 'Event has started';
		} else if (min < 60) {
			return `Starting in ${min} minutes`;
		} else {
			return `Starting in ${Math.floor(min / 60)} hours ${min % 60} minutes`;
		}
	}

	function getEventImage(event: EventsRecord) {
		return event.banner
			? `${PUBLIC_PB_URL}/api/files/events/${event.id}/${event.banner}`
			: defaultImages[event.sport.toLowerCase()] || '$lib/assets/images/default/sports.jpg';
	}
</script>

<div class="relative flex min-h-screen items-center justify-center">
	<!-- Header -->
	<Banner upper="app game app game app" center="arena app game" lower="game app game app" />
	{#if loaded}
		<div class="relative mt-[40px] flex w-[330px] flex-col items-start">
			{#if mainEvent}
				<!-- Main Event Title & Date -->
				<div class="font-roboto w-full truncate text-[12px] font-bold uppercase text-white/60">
					{formatDateCountdown(mainEvent.startTime)}
				</div>
				<div class="font-inter w-full truncate text-[20px] font-semibold text-white">
					{mainEvent.title}
				</div>

				<!-- Main Event Image -->
				<div class="mt-3 h-[193px] w-[330px] overflow-hidden rounded-[14px] bg-white">
					<a href={`/sports?eventId=${mainEvent.id}`}>
						<img
							class="h-full w-full rounded-[14px] object-cover"
							src={getEventImage(mainEvent)}
							alt="Main Event"
						/>
					</a>
				</div>
			{:else}
				<div class="flex w-full select-none flex-col items-center gap-5">
					<Bird color="#77767b" size={144} />
					<div class="font-alata m-1 text-center">It looks like there are no events coming up!</div>
				</div>
			{/if}

			{#if otherEvents?.length}
				<!-- Other Events Section -->
				<div class="font-inter mt-4 flex w-full items-start text-[20px] font-semibold text-white">
					Other Events
				</div>

				<!-- Other Events List -->
				<div class="mt-3 flex gap-4">
					{#each otherEvents.slice(0, 2) as event}
						<div class="relative h-[160px] w-[160px] overflow-hidden rounded-[10px] bg-white">
							<a href={`/sports?eventId=${event.id}`}>
								<img
									class="h-full w-full rounded-[10px] object-cover"
									src={getEventImage(event)}
									alt={`Event ${event.title}`}
								/>
							</a>
							<div
								class="absolute bottom-0 left-0 w-full bg-black bg-opacity-40 p-2 text-xs text-white"
							>
								<p class="font-inter truncate text-[14px] font-semibold">{event.title}</p>
								<p class="font-roboto truncate text-[10px] font-bold uppercase text-white/70">
									{formatDate(event.startTime)}
								</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<Loader />
	{/if}
</div>
