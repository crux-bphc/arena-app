<script lang="ts">
	import { PUBLIC_PB_URL } from '$env/static/public';
	import { onMount } from 'svelte';

	import type { EventsRecord } from '$lib/types/pocketbase';
	import Loader from '$lib/components/Loader.svelte';

	interface EventsData {
		events: EventsRecord[];
	}

	onMount(() => {
		getEventsData();
	});

	let events = $state<EventsData | null>(null);
	let otherEvents = $state<EventsData | null>(null);
	let mainEvent = $state<EventsRecord | null>(null);

	async function getEventsData() {
		try {
			const response = await fetch(`api/events`);
			if (!response.ok) {
				console.error(`Failed to fetch leaderboard data: ${response.status}`);
				return;
			}
			events = await response.json();
			mainEvent = events['events'][0];
			otherEvents = events['events'].slice(1, 3);
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
		const options = { month: 'long', hour: 'numeric', minute: 'numeric', hour12: true };
		const formattedDate = `${day}${suffix} ${date.toLocaleString('en-US', options).replace(' at ', ', ')}`;
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
</script>

<div class="flex justify-center items-center min-h-screen relative">
	<!-- Header -->
	<div
		class="absolute left-1/2 top-[30px] w-[331px] h-[120px] bg-[#202020] border border-[#6A6A6A] rounded-[10px] overflow-hidden box-border transform -translate-x-1/2"
	>
		<div
			class="absolute left-[2px] top-[68px] w-[551px] h-[60px] flex items-center font-[Haettenschweiler] font-normal text-[68px] leading-[20px] text-[#91DE43]"
		>
			app game app game app
		</div>
		<div
			class="absolute left-[1px] top-[19px] w-[331px] h-[60px] flex items-center font-[Haettenschweiler] font-normal text-[68px] leading-[20px] text-[#91DE43]"
		>
			arena app game
		</div>
		<div
			class="absolute left-[1px] top-[-30px] w-[486px] h-[60px] flex items-center font-[Haettenschweiler] font-normal text-[68px] leading-[20px] text-[#91DE43]"
		>
			game app game app
		</div>
	</div>

	{#if mainEvent}
		<div class="relative mt-[40px] w-[330px] flex flex-col items-start">
			<!-- Main Event Title & Date -->
			<div
				class="w-full flex items-center uppercase font-roboto font-bold text-[12px] text-white/60"
			>
				{formatDateCountdown(mainEvent['startTime'])}
			</div>
			<div class="w-full flex items-center font-inter font-semibold text-[20px] text-white">
				{mainEvent['title']}
			</div>

			<!-- Main Event Image -->
			<div class="mt-3 w-[330px] h-[193px] bg-white rounded-[14px] overflow-hidden">
				<img
					class="w-full h-full object-cover rounded-[14px]"
					src={`${PUBLIC_PB_URL}/api/files/${mainEvent['collectionId']}/${mainEvent['id']}/${mainEvent['banner']}`}
					alt="main event image"
				/>
			</div>

			<!-- Other Events Section -->
			<div class="mt-4 w-full flex items-start font-inter font-semibold text-[20px] text-white">
				Other Events
			</div>

			<!-- Other Events List -->
			<div class="mt-3 flex gap-4">
				{#each otherEvents.slice(0, 2) as event}
					<div class="relative w-[160px] h-[160px] bg-white rounded-[10px] overflow-hidden">
						<img
							class="w-full h-full object-cover rounded-[10px]"
							src={`${PUBLIC_PB_URL}/api/files/${event['collectionId']}/${event['id']}/${event['banner']}`}
							alt={`Event ${event['title']} image`}
						/>
						<div
							class="absolute bottom-0 left-0 w-full bg-black bg-opacity-40 text-white p-2 text-xs"
						>
							<p class="font-inter font-semibold text-[14px] truncate">{event['title']}</p>
							<p class="font-roboto font-bold text-[10px] uppercase text-white/70 truncate">
								{formatDate(event['startTime'])}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<Loader />
	{/if}
</div>
