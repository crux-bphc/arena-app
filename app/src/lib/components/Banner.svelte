<script lang="ts">
	export let upper: string;
	export let center: string;
	export let lower: string;
</script>

<div
	class="font-inter text-foreground absolute top-7 flex w-full items-center justify-start truncate px-12 text-base font-semibold"
>
	<div class="">Looking for more points?</div>
</div>
<div
	class="font-inter text-foreground absolute top-12 flex w-full items-center justify-start truncate px-12 text-base font-semibold"
>
	<div class="">Jump into the game and start earning!</div>
</div>
<div
	class="absolute left-1/2 top-20 box-border h-[120px] w-[331px] -translate-x-1/2 transform overflow-hidden rounded-[10px] border border-[#6A6A6A] bg-[#202020]"
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
