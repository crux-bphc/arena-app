<script lang="ts">
	interface CalendarItemProps {
		colStart: number;
		rowStart: number;
		rowSpan: number;
		title: string;
		location: string;
		sport: string;
	}

	let { colStart, rowStart, rowSpan, title, location, sport }: CalendarItemProps = $props();
</script>

<div
	class="col-span-1 p-[3px]"
	style="grid-column-start: {colStart};
		grid-row: {rowStart} / span {rowSpan};"
>
	<div
		class="flex h-full w-full flex-col justify-between overflow-hidden rounded-sm bg-accent/80 px-2 py-1 text-xs font-alata"
	>
		<div class="flex flex-col {rowSpan > 6 ? 'gap-1' : ''}">
			<div class="line-clamp-2 font-bold text-accent-foreground/90">
				{title.toUpperCase()}
			</div>
			<div class="{rowSpan > 6 ? 'line-clamp-2' : 'line-clamp-1'} text-accent-foreground/70">
				{location.toUpperCase()}
			</div>
		</div>
		<div class="line-clamp-1 text-accent-foreground/70">{sport.toUpperCase()}</div>
	</div>
</div>
