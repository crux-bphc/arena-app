<script lang="ts">
	import { PUBLIC_PB_URL } from '$env/static/public';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';

	let { data } = $props();
</script>

<div class="flex flex-col items-center p-4">
	<div class="flex flex-row w-screen items-center justify-between px-3">
		<Avatar class="w-21 h-21">
			<AvatarImage
				src={`${PUBLIC_PB_URL}/api/files/users/${data.user?.id}/${data.user?.avatar}`}
				alt="Avatar"
			/>
			<AvatarFallback>{data.user?.name?.at(0) || 'X'}</AvatarFallback>
		</Avatar>
        <div class="flex flex-col gap-1 max-w">
            <p class="text-xl max-w-56 truncate">{data.user?.name}</p>
            <p class="text-sm text-gray-300">{data.user?.email}</p>
            <div class="mt-2 bg-primary text-black w-fit px-6 py-2 rounded-lg text-sm font-bold">{data.user?.balance} COINS</div>
        </div>
	</div>
</div>
