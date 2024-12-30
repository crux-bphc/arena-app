<script lang="ts">
    import { goto } from '$app/navigation'
    import type { PageData } from './$types';

    const { data }: { data: PageData } = $props();

    let bets = $state(data.bets);

    const get = async (dir) => {
        const res = await fetch(`/user/bets/api/${dir}`)
        if (res.status == 308)
            goto('/login')
        else 
            bets = await res.json();
    }

    const open = async () => get('open')

    const closed = async () => get('closed')
</script>
<!-- A template -->
<div>
    <div class="text-3xl m-2 font-bold text-center">Your bets</div>
    <div class="options place-content-center flex">
        <button onclick={open} class="bg-amber-200 p-1 rounded-sm ms-2">Open</button>
        <button onclick={closed} class="bg-amber-200 p-1 rounded-sm ms-2">Closed</button>
    </div>
    <div class="bet flex place-items-center flex-col gap-2 m-2">
        {#each bets as bet}
            <div class="item bg-slate-700 rounded-md p-2 h-fit w-fit text-amber-100">
                <div>
                    <span id="coins" class="font-bold"><u>{bet.coins}</u></span> <label for="coins">Coins bet</label> 
                </div>
                <div>
                    <label class="font-bold" for="sport"><u>Event:</u> </label> <span id="sport">{bet.sport}</span>
                </div>
                <div>
                    <label class="font-bold" for="team"><u>Team:</u> </label> <span id="team">{bet.team}</span>
                </div>
                <div>
                    <label class="font-bold" for="time"><u>Time bet:</u> </label> <span id="time">{new Date(bet.updated)}</span>
                </div>
            </div>
        {:else}
        <div class="no-bet bg-slate-700 rounded-md p-2 h-fit w-fit m-2 text-amber-100">
            No bets found yet! Head over <a href="/user/bet/new"><u>here</u></a> to make a new bet.
        </div>
        {/each}
    </div>
</div>