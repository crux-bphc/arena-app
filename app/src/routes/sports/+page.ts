import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { EventsRecordWithStandings } from '$lib/types/expand';

export const load: PageLoad = async ({ fetch }: { fetch: Function }) => {
	// let searchParams = new URLSearchParams([['standings', 'true']]).toString();
	// console.log(searchParams);
	let res = await fetch('/api/events?standings=true');

	if (res.status == 308) redirect(308, '/login');

	let events: EventsRecordWithStandings[] = (await res.json())?.events;
	return { events };
};
