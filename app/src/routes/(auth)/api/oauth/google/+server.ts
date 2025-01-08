import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_AUTH_REDIRECT_URL } from '$env/static/public';
import { STARTING_BALANCE } from '$env/static/private';
import type { AuthProviderInfo } from 'pocketbase';
import pb from '$lib/server/database';

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	const provider: AuthProviderInfo | undefined = JSON.parse(
		cookies.get('google_oauth_provider') || 'undefined'
	);
	const storedState = provider?.state;

	if (!code || !state || !storedState || state !== storedState) {
		return error(403, 'Invalid auth state');
	}

	// Get the time before the user is authenticated to determine the state of the user (new / old)
	const now = Date.now();

	const { record: user } = await locals.pb
		.collection('users')
		.authWithOAuth2Code(provider.name, code, provider.codeVerifier, PUBLIC_AUTH_REDIRECT_URL);
	console.log(user);

	// This is a new user, since the created time is greater than the time when the authentication was queried
	if (new Date(user.created).getTime() > now) {
		const newUser = await pb.collection('users').update(user.id, { balance: STARTING_BALANCE});
		console.log('Updated new user balance:', newUser.balance);
	}

	return redirect(302, '/');
};
