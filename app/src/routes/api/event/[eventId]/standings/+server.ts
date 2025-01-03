import pb from '$lib/server/database';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// This does not require login
const handleGET: RequestHandler = async ({ params }: { params: { eventId: string } }) => {
	try {
        // Sort the teams which are participating in the event by position in standings in asc. order
        const standings = 
            await pb
                .collection('standings')
                .getFullList({ 
                    filter: `eventId.id="${params.eventId}"`, 
                    expand: 'eventId, teamId', 
                    sort: 'position' 
                });
        return json({ standings })
	} catch (err) {
		return error(500, `Failed to get team leaderboard data due to error: ${err}`);
	}
};

export const GET = handleGET;
