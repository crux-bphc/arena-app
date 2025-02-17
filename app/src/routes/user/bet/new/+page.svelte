<style>
    .none {
        display: none;
    }

    #event {
        text-align: left;
        width: 100%;
    }
</style>

<script lang="ts">
    import { goto } from '$app/navigation'
	import { onMount } from 'svelte';
    import type { PageData } from './$types';
    const { data }: { data: PageData } = $props();

    let balance = $state(0);

    onMount(async () => {
        await getBalance();
    });

    let events = $state(data.events);

    let teams = $state([]);
    let selectedEvent = $state(null);

    let eventNameAndSport = $state('Event Name/Sport');

    // A function to compare events by when it starts / ends (probably could have been done in database.ts?)
    const order = (start: string, end: string) => {
        const now = Date.now();
        const startTime = new Date(start).getTime(), endTime = new Date(end).getTime();
        // Event has ended
        if (endTime < now) return 2;
        // Event is ongoing
        if (startTime <= now && endTime >= now) return 1;
        // Event has not yet started
        if (startTime < now) return 3;
        return 0;
    }

    // Sort the events by their state
    $effect(() => {
        events = 
            events
            .sort(
                (
                    { startTime: sa, endTime: ea }: { startTime: string, endTime: string }, 
                    { startTime: sb, endTime: eb }: { startTime: string, endTime: string }
                ) => {
                    let a = order(sa, ea), b = order(sb, eb);
                    return a - b
            });
    }) 

    // Update user balance
    async function getBalance() {
        try {
            const res = await fetch('/api/user/balance')
            const { balance: bal }: { balance: number } = await res.json();

            balance = bal;

        } catch(error) {
            console.error('Failed to get user balance, error:', error)
        }
    }

    // TODO: Change alerts and confirms to an actual modal
    async function bet() {
        const { name, event, teamId, eventId } = this;
        // TODO?: Add input to allow user to enter custom amount of coins
        let coins = 10;

        // This is client side
        if (coins == 0) {
            alert('You\'re trying to bet 0 coins!');
            return;
        }

        if (balance < coins) {
            alert('Your balance is too low!');
            return;
        }

        let sign = coins > 0 ? '+' : '-';

        // Confirm once again with user
        if (!confirm(`Are you sure you want to bet ${sign}${coins} coins on team ${name} participating in the event ${event}?`)) return;

        const res = await fetch('/api/user/bet', { method: 'POST', body: JSON.stringify({ teamId, eventId, amount: coins }) })
        
        // Get event data again
        const eventRes = await fetch('/api/events')
        events = (await eventRes.json())?.events;
        
        // Redirects don't seem to work on the server side
        // This is probably not a good alternative though
        if (res.status == 308) goto('/login')
    
        await getBalance();

        const json = await res.json();
        if (res.status == 400)
            alert(`An error occured while trying to process your request: ${json.message}`);
        else 
            alert(`Successfully bet for team ${name} in event ${event}! You now have ${balance} coins remaining, and have bet a total of ${json.amount} coins in this division.`);
    }

    // Load teams into the teams view and enable the modal
    async function displayTeams() {
        const { id, title, sport, startTime } = this;
        if (new Date(startTime).getTime() < Date.now()) {
            alert('This event can no longer accept bets!')
            return;
        }

        const res = await fetch(`/api/event/${id}`);
        selectedEvent = await res.json();
        teams = selectedEvent?.expand.teams;

        document.querySelector('.modal')?.classList.remove('none');
        eventNameAndSport = `${title}/${sport}`;
    }

    // Function to hide modal when clicked outside the teams view
    function clickModal(event) {
        const modal = document.querySelector('.modal');
        if (event.target == modal) {
            modal?.classList.add('none');
        }
    }

    // Helper function to append suffixes to position of leaderboard
    function position(item: number) {
        switch (item) {
            case 1: return "1st"
            case 2: return "2nd"
            case 3: return "3rd"
            default:
                return item + 'th'
        }
    }
</script>

<!-- A template -->
<div id="balance" class="inline-block font-bold text-l m-2 bg-slate-700 rounded-md p-2 w-fit text-amber-100">{ balance } Coins</div>
<a href="/user/bets" class="text-l my-2 bg-slate-700 rounded-md p-2 w-fit text-amber-100 underline">View your bets</a>
<div class="text-3xl m-2 font-bold text-center">Events</div>
<div class="gap-2 m-2" id="events">
{#each events as event} 
    <button onclick={displayTeams.bind({ id: event.id, title: event.title, startTime: event.startTime, sport: event.sport })} id="event" class="bg-slate-700 rounded-md p-2 h-fit my-2 text-amber-100 flex flex-row place-items-center place-content-between">
        <div id="stats">
            <div>
                <label class="font-bold" for="name"><u>Title:</u> </label> <span id="name">{event.title}</span>
            </div>
            <div>
                <label class="font-bold" for="event"><u>Sport:</u> </label> <span id="event">{event.sport}</span>
            </div>
            <div>
                <label class="font-bold" for="desc"><u>Description:</u> </label> <span id="desc">{event.description}</span>
            </div>
            <div>
                <label class="font-bold" for="loc"><u>Location:</u> </label> <span id="loc">{event.location}</span>
            </div>

            <!-- Rudimentary thing, sort of inaccurate I think -->
            {#if (new Date(event.startTime).getTime() >= Date.now())}
                <div>
                    <label class="font-bold" for="time"><u>This event starts in:</u> </label> <span id="time">{#if ((new Date(event.startTime).getTime() - Date.now()) / (1000.0 * 60.0) < 1)}
                    &lt;1min
                    {:else}
                    {Math.floor((new Date(event.startTime).getTime() - Date.now()) / (1000.0 * 60.0))}min
                    {/if}
                    </span>
                </div>
                <div class="font-bold">Click to place your bets before time runs out!</div>
            {:else}
                {#if (new Date(event.endTime).getTime() <= Date.now())}
                    <div><span class="font-bold">This event has concluded</span></div>
                {:else}
                    <div><span class="font-bold">This event is live</span></div>
                {/if}
            {/if}
        </div>
    </button>
{:else}
    <div class="bg-slate-700 rounded-md p-2 h-fit w-fit m-2 text-amber-100 text-center">
        No events registered yet!
    </div>
{/each}
</div>

<div onclick={clickModal} role="button" tabindex="0" onkeypress="{clickModal}" class="modal absolute left-0 top-0 h-screen w-screen flex none text-left" style="background-color: rgba(50, 50, 50, 0.80); backdrop-filter: blur(4px);">
    <div class="message-box bg-slate-700 m-auto p-4 rounded-md flex flex-col text-amber-100 gap-2 overflow-auto" style="min-width: 30%; max-height:75%;">
        <div id="event-name" class="font-bold text-3xl place-self-center">{eventNameAndSport}</div>
        {#each teams as team}
        <div id="team" class="flex flex-row bg-slate-800 p-2 rounded-md place-content-between gap-2">
            <div id="stats">
                <div>
                    <label class="font-bold" for="name"><u>Team:</u> </label> <span id="name">{team.name}</span>
                </div>
                <!-- <div>
                    <label class="font-bold" for="score"><u>Score:</u> </label> <span id="score">{team.score}</span>
                </div>
                <div>
                    <label class="font-bold" for="leaderboard"><u>Leaderboard:</u> </label> <span id="score">{position(team.position)}</span>
                </div> -->
            </div>
            <!-- This should be an input I guess? -->
            <div id="buttons" class="place-self-center justify-self-center">
                <button onclick={bet.bind({ name: team.name, event: selectedEvent.title, teamId: team.id, eventId: selectedEvent.id })} class="bg-amber-200 p-1 rounded-sm text-black h-fit">Bet +10 Coins</button>
            </div>
        </div>
        {:else}
        <div class="bg-slate-800 p-2 rounded-md place-content-between text-center">
            No registered teams found
        </div>
        {/each}
    </div>
</div>