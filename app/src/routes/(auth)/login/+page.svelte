<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import header from '$lib/assets/images/login/header.svg';
	import google from '$lib/assets/images/login/google.svg';
</script>

<div
	class="background absolute flex h-full w-full select-none flex-col items-center justify-center gap-7 font-bold"
>
	<!-- Arena 2025 svg logo because css is hard -->
	<img src={header} alt="Arena 2025 header" class="pointer-events-none" />
	<a href="/api/oauth">
		<Button
			class="active:bg-grey-300 flex w-64 gap-2 rounded-xl bg-white font-semibold hover:bg-gray-300"
		>
			<img src={google} alt="Arena 2025 header" class="pointer-events-none inline" />
			<span class="text-accent text-xs font-bold"> SIGN IN WITH GOOGLE </span>
		</Button>
	</a>
	<div class="text-primary absolute bottom-2 right-2 self-end justify-self-end text-xl font-bold">
		powered by cruX
	</div>
</div>

<style>
	.background {
		background: url('$lib/assets/images/login/spots.png');
	}
</style>
