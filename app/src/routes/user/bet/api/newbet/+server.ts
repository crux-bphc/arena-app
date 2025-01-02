import { error, json, type RequestHandler } from '@sveltejs/kit';
import pb from '$lib/server/database';
import type { BetsResponse } from '$lib/types/pocketbase';
import type { BetExpand } from '$lib/types/expand';

const handlePOST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return error(401, 'User not found');
	}

	const { teamId, eventId, amount } = await request.json();
	const userid = locals.user.id;

	if (locals.user.balance < amount) {
		return error(400, 'Balance too low!');
	}

	let bet = (
		await pb.collection('bets').getFullList({
			filter: `userId="${locals.user.id}" && teamId="${teamId}" && eventId="${eventId}"`,
			expand: 'eventId'
		})
	).at(0) as BetsResponse<BetExpand> | undefined;

	const now = Date.now();

	let newBet: BetsResponse;
	if (bet) {
		if (bet.amount + amount < 0) {
			return error(400, 'Bet amount cannot be negative!');
		}

		const startTime = new Date(bet.expand?.eventId.startTime ?? '').getTime();
		if (now > startTime) {
			return error(400, 'Bets are closed!');
		}

		newBet = await pb.collection('bets').update(bet.id, { amount: bet.amount + amount });
	} else {
		if (amount < 0) {
			return error(400, 'Bet amount cannot be negative!');
		}

		const event = await pb.collection('events').getFirstListItem(`id="${eventId}"`);
		const startTime = new Date(event.startTime).getTime();
		if (now > startTime) {
			return error(400, 'Bets are closed!');
		}

		newBet = await pb
			.collection('bets')
			.create({ userId: locals.user.id, teamId, eventId, amount });
	}

	await pb.collection('users').update(userid, { balance: locals.user.balance - amount });
	return json(newBet);
};

export const POST = handlePOST;
