<script lang="ts">
	export let upper: string;
	export let center: string;
	export let lower: string;
</script>

<div class="flex w-[330px] flex-col items-center justify-center px-1 py-8">
	<div
		class="font-inter text-foreground flex w-full flex-col items-start justify-center truncate text-base font-semibold"
	>
		<div>Looking for more points?</div>
		<div>Jump into the game and start earning!</div>
	</div>
	<div
		class="border-primary bg-secondary box-border h-[120px] w-[331px] transform overflow-hidden rounded-[10px] border"
	>
		<div
			class="absolute left-[2px] top-[68px] flex h-[60px] w-[551px] items-center font-[Haettenschweiler] text-[68px] font-normal leading-[20px] text-[#91DE43]"
		>
			{upper}
		</div>
		<div
			class="absolute left-[1px] top-[19px] flex h-[60px] w-[331px] items-center font-[Haettenschweiler] text-[68px] font-normal leading-[20px] text-[#91DE43]"
		>
			{center}
		</div>
		<div
			class="absolute left-[1px] top-[-30px] flex h-[60px] w-[486px] items-center font-[Haettenschweiler] text-[68px] font-normal leading-[20px] text-[#91DE43]"
		>
			{lower}
		</div>
	</div>
</div>
