import pb from '$lib/server/database';
import type { BetsResponse, EventsResponse, TeamsResponse } from '$lib/types/pocketbase';
import { error, json, type RequestHandler } from '@sveltejs/kit';

type Expand = { eventId: EventsResponse; teamId: TeamsResponse };

const handleGET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) {
		return error(401, 'User not found');
	}

	const open = url.searchParams.get('open') === 'true';

	try {
		const bets: BetsResponse<Expand>[] = await pb
			.collection('bets')
			.getFullList({ filter: `userId="${locals.user.id}"`, expand: 'teamId,eventId' });

		const now = Date.now();
		const filteredBets = bets.filter((bet) => {
			const startTime = new Date(bet.expand?.eventId.startTime ?? '').getTime();
			return open ? startTime > now : startTime < now;
		});

		return json({ bets: filteredBets });
	} catch (err) {
		return error(500, `Failed to get bets: ${err}`);
	}
};

export const GET = handleGET;