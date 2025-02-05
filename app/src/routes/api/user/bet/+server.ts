import { error, json, type RequestHandler } from '@sveltejs/kit';
import pb from '$lib/server/database';
import { z } from 'zod';
import type { BetsResponse } from '$lib/types/pocketbase';
import type { BetExpand } from '$lib/types/expand';

export const _betCreateSchema = z.object({
	teamId: z.string(),
	eventId: z.string(),
	amount: z.number().int()
});

const handlePOST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return error(401, 'User not found!');
	}

	const { teamId, eventId, amount } = await request.json();

	let event;
	try {
		event = (await pb.collection('events').getFullList({ filter: `id="${eventId}"` })).at(0);
	} catch (err) {
		console.error(`Failed to get event while placing bet: ${err}`);
		return error(500);
	}

	if (!event) {
		return error(400, 'Event not found!');
	}

	if (!event.teams.includes(teamId)) {
		return error(400, 'Team not found!');
	}

	let bet;
	try {
		bet = (
			await pb.collection('bets').getFullList({
				filter: `user="${locals.user.id}" && team="${teamId}" && event="${eventId}"`,
				expand: 'event'
			})
		).at(0) as BetsResponse<BetExpand> | undefined;
	} catch (err) {
		console.error(`Failed to check bet existence while placing bet: ${err}`);
		return error(500);
	}

	const now = Date.now();

	let newBet: BetsResponse;
	let delta = 0;
	if (bet) {
		if (amount < 0) {
			return error(400, 'Bet amount cannot be negative!');
		}

		const startTime = new Date(bet.expand?.event.startTime ?? '').getTime();
		if (now > startTime) {
			return error(400, 'Bets are closed!');
		}

		try {
			delta = amount - bet.amount; 
			if (delta > locals.user.balance) {
				return error(400, 'Balance too low!');
			}
			newBet = await pb.collection('bets').update(bet.id, { amount });
		} catch (err) {
			console.error(`Failed to update bet: ${err}`);
			return error(500);
		}
	} else {
		if (amount < 0) {
			return error(400, 'Bet amount cannot be negative!');
		}

		const startTime = new Date(event.startTime).getTime();
		if (now > startTime) {
			return error(400, 'Bets are closed!');
		}

		try {
			delta = amount;
			if (delta > locals.user.balance) {
				return error(400, 'Balance too low!');
			}
			newBet = await pb
				.collection('bets')
				.create({ user: locals.user.id, team: teamId, event: eventId, amount });
		} catch (err) {
			console.error(`Failed to create bet: ${err}`);
			return error(500);
		}
	}

	try {
		let betPool = (
			await pb.collection('betPool').getFullList({
				filter: `team="${teamId}" && event="${eventId}"`
			})
		).at(0);

		if (betPool) {
			await pb.collection('betPool').update(betPool.id, { amount: betPool.amount + delta });
		} else {
			await pb.collection('betPool').create({ event: eventId, team: teamId, amount: delta });
		}
	} catch (err) {
		console.error(`Failed to fetch and update bet pool: ${err}`);
		return error(500);
	}

	try {
		await pb.collection('users').update(locals.user.id, { balance: locals.user.balance - delta });
	} catch (err) {
		console.error(`Failed to update user balance: ${err}`);
		return error(500);
	}
	return json(newBet);
};

export const POST = handlePOST;
