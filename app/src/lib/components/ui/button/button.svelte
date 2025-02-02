<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { type Events, type Props, buttonVariants } from './index.js';
	import { cn } from '$lib/shadcn-utils.js';

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let width: $$Props['width'] = 'unset';
	export let size: $$Props['size'] = 'default';
	export let builders: $$Props['builders'] = [];
	export { className as class };

	const computeWidth = () => {
		switch (width) {
			case 'long': return 'min-w-44';
			case 'short': return 'min-w-28';
			default: return '';
		}
	}

</script>

<ButtonPrimitive.Root
	{builders}
	class="{cn(buttonVariants({ variant, size, className }))} {variant == 'calendar' ? computeWidth() : ''}"
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<!-- this condition is just so this component can be used in other places too -->
	{#if variant === 'navbar'}
		<span
			class="absolute inset-7 rounded-full bg-primary transition-all duration-100 ease-in group-[.on-page]:inset-0"
		></span>
		<span class="z-10">
			<slot />
		</span>
	{:else if variant == 'calendar'}
		<span
			class="absolute inset-0 rounded-md bg-secondary"
		></span>
		<span
			class="absolute inset-7 rounded-md bg-primary transition-all duration-100 ease-in group-[.active]:inset-0"
		></span>
		<span class="z-10">
			<slot />
		</span>
	{:else}
		<slot />
	{/if}
</ButtonPrimitive.Root>
