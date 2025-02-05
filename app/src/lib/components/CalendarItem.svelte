<script lang="ts">
	import { redirect } from '@sveltejs/kit';

	interface CalendarItemProps {
		colStart: number;
		rowStart: number;
		rowSpan: number;
		title: string;
		location: string;
		sport: string;
		id: string,
	}

	let { colStart, rowStart, rowSpan, title, location, sport, id }: CalendarItemProps = $props();
</script>

<a
	class="col-span-1 p-[3px] block"
	style="grid-column-start: {colStart};
		grid-row: {rowStart} / span {rowSpan};"
	href="/sports?eventId={id}"

>
	<div
		class="bg-accent/90 font-alata flex h-full w-full flex-col justify-between overflow-hidden rounded-md px-2 py-1 text-xs"
	>
		{#if rowSpan > 2}
			<div class="flex flex-col {rowSpan > 6 ? 'gap-1' : ''}">
				<div class="text-accent-foreground/90 line-clamp-2 font-bold">
					{title.toUpperCase()}
				</div>
				<div class="{rowSpan > 6 ? 'line-clamp-2' : 'line-clamp-1'} text-accent-foreground/70">
					{location.toUpperCase()}
				</div>
			</div>
			<div class="text-accent-foreground/70 line-clamp-1">{sport.toUpperCase()}</div>
		{:else}
			<div class="text-accent-foreground/90 my-auto line-clamp-2 inline-flex gap-1 font-bold">
				<span class="overflow-hidden overflow-ellipsis whitespace-nowrap"
					>{title.toUpperCase()}</span
				>
				<span class="text-accent-foreground/60">at</span>
				<span class="overflow-hidden overflow-ellipsis whitespace-nowrap"
					>{location.toUpperCase()}</span
				>
			</div>
		{/if}
	</div>
</a>
