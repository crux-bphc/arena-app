import pb from '$lib/server/database';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// This does not require login
const handleGET: RequestHandler = async ({ params }) => {
	try {
		const { eventId } = params;

		const event = (
			await pb.collection('events').getFullList({ filter: `id="${eventId}"`, expand: 'teams' })
		).at(0);

		return json(event);
	} catch (err) {
		console.error(`Failed to get event details: ${err}`);
		return error(500);
	}
};

export const GET = handleGET;
