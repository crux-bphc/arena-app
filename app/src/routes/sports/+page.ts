import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { EventRecWithStandAndBet } from '$lib/types/expand';
import type { BetsRecord } from '$lib/types/pocketbase';

export const load: PageLoad = async ({ fetch, url }: { fetch: Function; url: URL }) => {
	// gets event data
	let res = await fetch('/api/events?standings=true&betPools=true');
	if (res.status == 308) redirect(308, '/login');
	let events: EventRecWithStandAndBet[] = (await res.json())?.events;

	// gets user's bet history
	let betRes = await fetch('/api/user/bets?open=true');
	if (betRes.status == 308) redirect(308, '/login');
	let bets: BetsRecord[] = (await betRes.json())?.bets;

	return { events, bets, url };
};
