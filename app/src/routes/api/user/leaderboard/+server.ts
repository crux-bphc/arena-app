import pb from '$lib/server/database';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// This does not require login
const handleGET: RequestHandler = async () => {
	try {
		// Sort by desc. order of balance -> More balance = higher on the leaderboard
		const users = await pb.collection('users').getFullList({ sort: '-balance' });
		return json({ users });
	} catch (err) {
		console.error(`Failed to get leaderboard: ${err}`);
		return error(500);
	}
};

export const GET = handleGET;
