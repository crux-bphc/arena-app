import pb from '$lib/server/database';
import type { EventsRecord } from '$lib/types/pocketbase';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { sportsPriority } from '$lib/sportsPriority';

// This does not require login
const handleGET: RequestHandler = async ({ url }: { url: URL }) => {
	// Filter by sport
	const sport = url.searchParams.get('sport');
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
			const options = { filter: `endTime > "${new Date().toISOString()}"`, limit: 10 };
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
                })
                .slice(0, 3);
			
			return json({ events: sortedEvents });
		} else {
			const options = sport ? { filter: `sport="${sport}"` } : {};
			const events: EventsRecord[] = await pb.collection('events').getFullList(options);
			return json({ events: events });
		}
	} catch (err) {
		console.error(`Failed to get events: ${err}`);
		return error(500);
	}
};

export const GET = handleGET;
