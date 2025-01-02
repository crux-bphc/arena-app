import pb from '$lib/server/database';
import type { StandingsExpand } from '$lib/types/expand';
import type { StandingsResponse } from '$lib/types/pocketbase';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// This does not require login
const handleGET: RequestHandler = async ({ params }: { params: { eventId: string } }) => {
    try {
		const { eventId } = params;

		const standings: StandingsResponse<StandingsExpand>[] = 
			await pb
				// This is querying standings, which is the only relation between events and teams.
				// But, this would not be able to access events that will air at a later time, if 
				// standings are updated as teams start playing.
				.collection('standings')
				// Is eventId expansion needed?
				.getFullList({ filter: `eventId="${eventId}"`, expand: 'teamId, eventId' });

		return json({ standings });
	} catch (err) {
		return error(500, `Failed to get team standings due to error: ${err}`);
	}
}

export const GET = handleGET;
