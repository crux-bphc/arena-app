import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return error(401, 'User not found!');
	}

	// this will always work because the `authentication` hook in `hooks.server.ts` always updates `locals` every request if the auth store is valid, and if it isn't, the `authorization` hook will redirect it away
	const balance = locals.user.balance;
	return json({ balance });
};
