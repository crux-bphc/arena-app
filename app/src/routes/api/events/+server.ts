import pb from '$lib/server/database';
import type { EventsRecord } from '$lib/types/pocketbase';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// This does not require login
const handleGET: RequestHandler = async ({ url }: { url: URL }) => {
	// Filter by sport
	const sport = url.searchParams.get('sport');
	try {
		const options = sport ? { filter: `sport="${sport}"` } : {};
		const events: EventsRecord[] = await pb.collection('events').getFullList(options);

		return json({ events });
	} catch (err) {
		console.error(`Failed to get events: ${err}`);
		return error(500);
	}
};

export const GET = handleGET;
