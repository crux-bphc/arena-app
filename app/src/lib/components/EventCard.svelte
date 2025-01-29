<script lang="ts">
	import type { EventsRecord } from '$lib/types/pocketbase';

	interface EventCardProps {
		isMinimized?: boolean;
		event: EventsRecord;
	}

	// if isMinimized is true, the whole component scales down
	// (this is for sports page when the side bar opens)
	let { isMinimized = false, event }: EventCardProps = $props();
	let status: 'finished' | 'ongoing' | 'starting soon' | 'default' = $state(getStatus(event));

	function getStatus(event: EventsRecord) {
		const now = new Date().getTime() + 1000 * 60 * 330;
		const startTime = new Date(event.startTime).getTime();
		const endTime = new Date(event.endTime).getTime();
		// Event has ended
		if (endTime < now) return 'finished';
		// Event is ongoing
		if (startTime <= now && endTime >= now) return 'ongoing';
		// Event has not yet started but starts in 3 hours
		if (startTime > now && startTime - now <= 1000 * 60 * 60 * 3) return 'starting soon';
		return 'default';
	}
</script>

<div
	class="bg-secondary flex w-full flex-col items-center justify-between gap-2 {isMinimized
		? 'rounded-lg p-2'
		: 'rounded-[10px] p-3'}"
>
	<div
		class="text-foreground/50 line-clamp-1 w-full text-start {isMinimized ? 'text-sm' : 'text-md'}"
	>
		<span class="uppercase">
			{#if status == 'default'}
				starts at 3 pm
			{:else}{status}{/if}
		</span>
		- {event.title}
	</div>

	<div class="flex flex-col w-full py-1 gap-1">
		<div class="flex w-full flex-row items-center justify-between font-bold {isMinimized ? "text-2xl" : "text-3xl"}">
			<div class="uppercase">BPHC</div>
			<div class="">3</div>
		</div>
		<div class="flex w-full flex-row items-center justify-between font-bold {isMinimized ? "text-2xl" : "text-3xl"}">
			<div class="uppercase">BPGC</div>
			<div class="">2</div>
		</div>
	</div>
	<div class="">BOTTOM TEXT</div>
</div>
