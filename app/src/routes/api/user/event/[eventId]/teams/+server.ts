import pb from '$lib/server/database';
import type { StandingsExpand } from '$lib/types/expand';
import type { StandingsResponse } from '$lib/types/pocketbase';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// This does not require login
const handleGET: RequestHandler = async ({ params }) => {
    try {
		const { eventId } = params;

		const standings: StandingsResponse<StandingsExpand>[] = 
			await pb
				// TODO: Change this to query events when database schema is changed to 
				// incorperate registerd teams in events
				.collection('standings')
				.getFullList({ filter: `eventId="${eventId}"`, expand: 'teamId, eventId' });

		return json({ standings });
	} catch (err) {
		return error(500, `Failed to get team standings due to error: ${err}`);
	}
}

export const GET = handleGET;
