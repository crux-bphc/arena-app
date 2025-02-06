import pb from '$lib/server/database';
import type { BetExpand } from '$lib/types/expand';
import type { BetsResponse } from '$lib/types/pocketbase';
import { error, json, type RequestHandler } from '@sveltejs/kit';

const handleGET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) {
		return error(401, 'User not found!');
	}

	const open = url.searchParams.get('open') === 'true';

	try {
		const bets: BetsResponse<BetExpand>[] = await pb
			.collection('bets')
			.getFullList({ filter: `user="${locals.user.id}"`, expand: 'team,event' });

		const now = Date.now();
		const filteredBets = bets.filter((bet) => {
			const done = bet.expand?.event.standingsUpdated;
			return open ? !done : done;
		});

		return json({ bets: filteredBets });
	} catch (err) {
		console.error(`Failed to get bets: ${err}`);
		return error(500);
	}
};

export const GET = handleGET;
