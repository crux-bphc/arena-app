<script lang='ts'>
    import { PUBLIC_PB_URL } from '$env/static/public';
    import { onMount } from 'svelte';
    import Loader from '$lib/components/Loader.svelte';

    let leaderboard = $state(null)

    async function getLeaderboardData(){
        try {
          const response = await fetch(`api/user/leaderboard`)
          if (!response.ok) {
            console.error(`Failed to fetch leaderboard data: ${response.status}`);
            return;
          }
          leaderboard = await response.json()
        } catch (e) {
          console.error(`Failed to fetch leaderboard data: ${e}`)
        }           
    }

    onMount(() => {
        getLeaderboardData()
    });
</script>

{#if leaderboard !== null}
<div class="max-w-2xl mx-auto rounded-lg overflow-hidden text-white p-4">
  <h1 class="text-3xl font-bold text-center mb-6">Leaderboard</h1>

  <ul class="space-y-6">
    {#each leaderboard.users as user, index}
      <li class="grid grid-cols-[0.5fr_2fr_1fr] items-center gap-[16px] p-4 rounded-lg shadow-lg bg-gray-800">
        <span class="position text-xl font-bold text-center">
          {index + 1}
        </span>
        <span class="user-details flex items-center">
          <img
            src={`${PUBLIC_PB_URL}/api/files/users/${user.id}/${user.avatar}`}
            alt="avatar"
            class="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          <span class="font-semibold text-lg ml-4 max-w-[200px] truncate text-ellipsis overflow-hidden">
            {user.name}
            {#if index === 0}
              <span class="ml-2 text-yellow-400">🏆</span>
            {:else if index === 1}
              <span class="ml-2 text-gray-300">🥈</span>
            {:else if index === 2}
              <span class="ml-2 text-yellow-600">🥉</span>
            {/if}
          </span>
        </span>
        <span class="text-lg font-bold text-center">
          {user.balance}
        </span>
      </li>
    {/each}
  </ul>
</div>
{:else}
<Loader />
{/if}
