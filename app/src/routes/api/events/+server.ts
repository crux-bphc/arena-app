import pb from '$lib/server/database';
import type { EventsRecordWithStandings } from '$lib/types/expand';
import type { EventsRecord, StandingsRecord } from '$lib/types/pocketbase';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// This does not require login
const handleGET: RequestHandler = async ({ url }: { url: URL }) => {
	// Filter by sport
	const sport = url.searchParams.get('sport');
	const standings = url.searchParams.get('standings');
	try {
		const options = {
			filter: sport ? `sport="${sport}"` : ``,
			expand: `teams, ${standings === 'true' ? 'standings_via_event.team' : ''}`
		};

		const eventsData: any = await pb.collection('events').getFullList(options);
		// processing the incoming data to a nicer format
		const events: EventsRecordWithStandings[] = eventsData.map((event: any) => {
			const standings = event.expand?.standings_via_event?.map((standing: any) => {
				const team = standing.expand.team;
				delete standing.expand;
				return { ...standing, team: team };
			});
			const teams = event.expand.teams;
			delete event.expand;
			return { ...event, standings: standings, teams: teams };
		});

		return json({ events });
	} catch (err) {
		return error(500, `Failed to get events: ${err}`);
	}
};

export const GET = handleGET;
