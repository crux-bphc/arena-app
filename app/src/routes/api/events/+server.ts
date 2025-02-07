import pb from '$lib/server/database';
import type { EventRecWithStandAndBet } from '$lib/types/expand';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { sportsPriority } from '$lib/sportsPriority';
import type { EventsRecord } from '$lib/types/pocketbase';

// This does not require login
const handleGET: RequestHandler = async ({ url }: { url: URL }) => {
	// Filter by sport
	const sport = url.searchParams.get('sport');
	const isStandings = url.searchParams.get('standings') === 'true';
	const isBetPools = url.searchParams.get('betPools') === 'true';

	// Filter by priority
	const isPriority = url.searchParams.get('priority');
	// Filter by bet pool
	const isPool = url.searchParams.get('pool');
	try {
		if (isPriority) {
			// Only return events that are yet to happen
			// Only return one event per sport
			const options = { filter: `endTime > "${new Date().toISOString()}"` };
			const events: EventsRecord[] = await pb.collection('events').getFullList(options);
			
			const uniqueSports = new Set<string>();

			const sortedEvents: EventsRecord[] = events
				.filter(event => sportsPriority.includes(event.sport))
				.sort((a, b) => sportsPriority.indexOf(a.sport) - sportsPriority.indexOf(b.sport))
				.filter(event => {
						if (uniqueSports.has(event.sport)) {
							return false;
						}
						uniqueSports.add(event.sport);
						return true;
					});

			return json({ events: sortedEvents });
		} else if (isPool) {
			// Only return events that are yet to happen
			const options = { filter: `endTime > "${new Date(new Date().getTime() + 1000 * 60 * 330).toISOString()}"`};
			const events: EventsRecord[] = await pb.collection('events').getFullList(options);
			
			// Get the total amount in each event
			const eventsWithPools = await Promise.all(events.map(async (event) => {
                const poolData = await pb.collection('betPool').getFullList({ filter: `event.id="${event.id}"` });
				const totalAmount = poolData.reduce((sum: number, pool: any) => sum + pool.amount, 0);
				return { ...event, totalAmount };
            }));
			
			// Sort the events by total amount and then by start time
			const sortedEvents = eventsWithPools
                .sort((a, b) => {
                    if (b.totalAmount === a.totalAmount) {
                        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
                    }
                    return b.totalAmount - a.totalAmount;
                }).slice(0,10);
			
			return json({ events: sortedEvents });
		} else {
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
		}
	} catch (err) {
		console.error(`Failed to get events: ${err}`);
		return error(500);
	}
};

export const GET = handleGET;
