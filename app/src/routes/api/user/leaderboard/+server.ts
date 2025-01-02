import pb from '$lib/server/database';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// This does not require login
const handleGET: RequestHandler = async ({ url }: { url: URL }) => {
    // User-leaderboard or team leaderboard
	const userLeaderboard = url.searchParams.get('user') === 'true';
    // The title of the event in which each team is getting sorted
    const title = url.searchParams.get('title');
	try {
		// Client requested user leaderboard
        if (userLeaderboard) {
            // These are just sorted, is more processing required?
            // Sort by desc. order of balance -> More balance = higher on the leaderboard
            const users = await pb.collection('users').getFullList({ sort: '-balance' });
            return json({ users })
        } 
        // Client requested team standings leaderboard for the event {title}
        else {
            // Sort the teams which are participating in the event by position in standings in asc. order
            const standings = 
                await pb
                    .collection('standings')
                    .getFullList({ 
                        filter: `eventId.title="${title}"`, 
                        expand: 'eventId, teamId', 
                        sort: 'position' 
                    });
            return json({ standings })
        }
	} catch (err) {
		return error(500, `Failed to get leaderboard data due to error: ${err}`);
	}
};

export const GET = handleGET;
