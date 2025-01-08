import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_AUTH_REDIRECT_URL } from '$env/static/public';
import type { AuthProviderInfo } from 'pocketbase';
import { STARTING_BALANCE } from '$env/static/private';

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

	const { record: user } = await locals.pb
		.collection('users')
		.authWithOAuth2Code(provider.name, code, provider.codeVerifier, PUBLIC_AUTH_REDIRECT_URL, { balance: STARTING_BALANCE });
	console.log(user);

	return redirect(302, '/');
};
