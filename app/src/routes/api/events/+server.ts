import pb from '$lib/server/database';
import type { EventRecWithStandAndBet } from '$lib/types/expand';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// This does not require login
const handleGET: RequestHandler = async ({ url }: { url: URL }) => {
	// Filter by sport
	const sport = url.searchParams.get('sport');
	const isStandings = url.searchParams.get('standings') === 'true';
	const isBetPools = url.searchParams.get('betPools') === 'true';
	try {
		const options = {
			filter: sport ? `sport="${sport}"` : ``,
			expand: `teams, ${isStandings ? ' standings_via_event.team' : ''}, ${isBetPools ? 'betPool_via_event, bets_via_event' : ''}`,
			sort: 'startTime'
		};

		const eventsData: any = await pb.collection('events').getFullList(options);
		// processing the incoming data to a nicer format
		const events: EventRecWithStandAndBet[] = eventsData.map((event: any) => {
			const standings = event.expand?.standings_via_event?.map((standing: any) => {
				const team = standing.expand.team;
				delete standing.expand;
				return { ...standing, team: team };
			});
			standings?.sort(
				(a: { position: number }, b: { position: number }) => a.position - b.position
			);
			const betPools = event.expand?.betPool_via_event;
			const userCount = new Set(
				event.expand?.bets_via_event?.map((obj: { user: string }) => obj.user)
			).size;

			const teams = event.expand.teams;
			delete event.expand;
			return {
				...event,
				standings,
				teams,
				betPools,
				userCount
			};
		});

		return json({ events });
	} catch (err) {
		return error(500, `Failed to get events: ${err}`);
	}
};

export const GET = handleGET;
