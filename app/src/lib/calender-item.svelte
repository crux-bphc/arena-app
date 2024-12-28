<script lang="ts">
	interface calenderItemProps {
		colStart: number;
		rowStart: number;
		rowSpan: number;
		title: string;
		location: string;
		sport: string;
	}

	let { colStart, rowStart, rowSpan, title, location, sport }: calenderItemProps = $props();
</script>

<div
	class="bg-red- col-span-1 px-1 py-0.5"
	style="grid-column-start: {colStart};
		grid-row: {rowStart} / span {rowSpan};"
>
	<div class="flex h-full w-full flex-col justify-between rounded-md bg-blue-900 px-2 py-1 text-xs">
		<div class="flex flex-col {rowSpan > 6 && 'gap-1'}">
			<div class="line-clamp-2 font-bold">
				{title}
			</div>
			<div class={rowSpan > 6 ? 'line-clamp-2' : 'line-clamp-1'}>
				{location}
			</div>
		</div>
		<div class="line-clamp-1 text-white/80">{sport}</div>
	</div>
</div>
