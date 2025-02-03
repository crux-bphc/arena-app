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
		console.error(`Failed to get event standings: ${err}`);
		return error(500);
	}
};

export const GET = handleGET;
