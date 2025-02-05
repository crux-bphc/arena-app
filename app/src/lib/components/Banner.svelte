<script lang="ts">
	export let upper: string;
	export let center: string;
	export let lower: string;
</script>

<div
	class="absolute left-1/2 top-[30px] w-[331px] h-[120px] bg-[#202020] border border-[#6A6A6A] rounded-[10px] overflow-hidden box-border transform -translate-x-1/2"
>
	<div
		class="absolute left-[2px] top-[68px] w-[551px] h-[60px] flex items-center font-[Haettenschweiler] font-normal text-[68px] leading-[20px] text-[#91DE43]"
	>
		{upper}
	</div>
	<div
		class="absolute left-[1px] top-[19px] w-[331px] h-[60px] flex items-center font-[Haettenschweiler] font-normal text-[68px] leading-[20px] text-[#91DE43]"
	>
		{center}
	</div>
	<div
		class="absolute left-[1px] top-[-30px] w-[486px] h-[60px] flex items-center font-[Haettenschweiler] font-normal text-[68px] leading-[20px] text-[#91DE43]"
	>
		{lower}
	</div>
</div>
