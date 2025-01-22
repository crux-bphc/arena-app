import pb from '$lib/server/database';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// This does not require login
const handleGET: RequestHandler = async ({ params }) => {
	try {
		const betPools = await pb
			.collection('betPool')
			.getFullList({ filter: `event.id="${params.eventId}"` });
		return json(betPools);
	} catch (err) {
		return error(500, `Failed to get event bet pools: ${err}`);
	}
};

export const GET = handleGET;
