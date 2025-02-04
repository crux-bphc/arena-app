<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_PB_URL } from '$env/static/public';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { LogOut } from 'lucide-svelte';

	let { data } = $props();
</script>

<div class="flex flex-col items-center p-4 gap-6">
	<div class="flex w-screen flex-row items-center justify-between px-3">
		<Avatar class="w-21 h-21">
			<AvatarImage
				src={`${PUBLIC_PB_URL}/api/files/users/${data.user?.id}/${data.user?.avatar}`}
				alt="Avatar"
			/>
			<AvatarFallback>{data.user?.name?.at(0) || 'X'}</AvatarFallback>
		</Avatar>
		<div class="max-w flex flex-col gap-1">
			<div class="flex flex-row items-center gap-2">
				<p class="max-w-56 truncate text-xl">{data.user?.name}</p>
				<form method="POST" action="?/logout" use:enhance>
					<Button class="mt-0.5 p-0" variant="outline" type="submit"><LogOut size={16} /></Button>
				</form>
			</div>
			<p class="text-sm text-gray-300">{data.user?.email}</p>
			<div class="bg-primary mt-2 w-fit rounded-lg px-6 py-2 text-sm font-bold text-black">
				{data.user?.balance} COINS
			</div>
		</div>
	</div>
	<Separator />
</div>
