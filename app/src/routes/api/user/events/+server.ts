import pb from '$lib/server/database';
import type { EventsRecord } from '$lib/types/pocketbase';
import { error, json, type RequestHandler } from '@sveltejs/kit';

const handleGET: RequestHandler = async ({ locals, url }) => {
	
    if (!locals.user)
		return error(401, 'User not found');

    // Filter by sport and title
	const sport = url.searchParams.get('sport');
	const title = url.searchParams.get('title');
	try {

        let filter = '';
    
        if (sport) filter += `sport="${sport}"`;
        if (title) {
            // If there is a sport queried, append the AND symbol
            if (filter != '') filter += '&&';
            filter += `title="${title}"`;
        }
		
        const events: EventsRecord[] = await pb.collection('events').getFullList({ filter });

		return json({ events });

	} catch (err) {
		return error(500, `Failed to get events due to error: ${err}`);
	}
}

export const GET = handleGET;
