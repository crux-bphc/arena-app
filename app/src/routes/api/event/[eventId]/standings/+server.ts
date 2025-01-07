import pb from '$lib/server/database';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// This does not require login
const handleGET: RequestHandler = async ({ params }) => {
	try {
		// Sort the teams which are participating in the event by position in standings in asc. order
		const standings = await pb.collection('standings').getFullList({
			filter: `event.id="${params.eventId}"`,
			expand: 'event, team',
			sort: 'position'
		});
		return json({ standings });
	} catch (err) {
		return error(500, `Failed to get team leaderboard data due to error: ${err}`);
	}
};

export const GET = handleGET;
