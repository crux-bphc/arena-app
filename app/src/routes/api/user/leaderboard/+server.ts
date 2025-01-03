import pb from '$lib/server/database';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// This does not require login
const handleGET: RequestHandler = async () => {
	try {
        // Sort by desc. order of balance -> More balance = higher on the leaderboard
        const users = await pb.collection('users').getFullList({ sort: '-balance' });
        return json({ users })
	} catch (err) {
		return error(500, `Failed to get user leaderboard data due to error: ${err}`);
	}
};

export const GET = handleGET;
