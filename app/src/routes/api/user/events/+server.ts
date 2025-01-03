import pb from '$lib/server/database';
import type { EventsRecord } from '$lib/types/pocketbase';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// This does not require login
const handleGET: RequestHandler = async ({ url }: { url: URL }) => {
	// Filter by sport
	const sport = url.searchParams.get('sport');
	try {
        let filter = null;
    
        if (sport) filter = `sport="${sport}"`;
		
        const events: EventsRecord[] = await pb.collection('events').getFullList({ filter });

		return json({ events });
	} catch (err) {
		return error(500, `Failed to get events due to error: ${err}`);
	}
}

export const GET = handleGET;
