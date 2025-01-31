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
		} else {
			const options = sport ? { filter: `sport="${sport}"` } : {};
			const events: EventsRecord[] = await pb.collection('events').getFullList(options);
			return json({ events: events });
		}
	} catch (err) {
		return error(500, `Failed to get events: ${err}`);
	}
};

export const GET = handleGET;
