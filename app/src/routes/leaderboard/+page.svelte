<script>
    import { PUBLIC_PB_URL } from '$env/static/public';
    import { onMount } from 'svelte';
    import Loader from '$lib/components/ui/Loader.svelte';

    let leaderboard = $state()

    async function getLeaderboardData(){
        console.log('fetching leaderboard data')
        const data = await fetch(`api/user/leaderboard`)
        leaderboard = await data.json()
    }
    onMount(() => {
        getLeaderboardData()
	});
</script>

<style>
    .leaderboard-container {
    max-width: 800px;
    margin: 0 auto;
    border-radius: 8px;
    overflow: hidden;
  }

  li {
    display: grid;
    grid-template-columns: 0.5fr 2fr 1fr;
    align-items: center;
    gap: 16px;
  }

  img {
    object-fit: cover;
  }

  .user-details {
    display: flex;
    align-items: center;
  }

  .user-name {
    margin-left: 16px;
  }

  .position {
    color: #919cab; 
  }
</style>

{#if leaderboard !== undefined}
<div class="leaderboard-container text-white p-4">
    <h1 class="text-3xl font-bold text-center mb-6">Leaderboard</h1>
    
    <ul class="space-y-6">
      {#each leaderboard.users as user, index}
        <li class="grid grid-cols-3 items-center p-4 rounded-lg shadow-lg bg-gray-800">
          <span class="position text-xl font-bold text-center">
            {index + 1}
          </span>
          <span class="user-details">
            <img
              src={`${PUBLIC_PB_URL}/api/files/users/${user.id}/${user.avatar}`}
              alt="avatar"
              class="w-12 h-12 rounded-full border-2 border-white"
            />
            <span class="font-semibold text-lg user-name">
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
