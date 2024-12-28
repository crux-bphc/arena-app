<script>
	let { colStart, rowStart, rowSpan } = $props();
</script>

<div
	class="col-span-1 bg-blue-500"
	style="grid-column-start: {colStart};
		grid-row: {rowStart} / span {rowSpan};"
></div>
