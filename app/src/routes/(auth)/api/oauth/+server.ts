import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_AUTH_REDIRECT_URL } from '$env/static/public';

export const GET: RequestHandler = async ({ locals, cookies }) => {
	const authMethods = await locals.pb.collection('users').listAuthMethods();
	const provider = authMethods.oauth2?.providers.at(0);

	if (!provider) {
		return error(500, 'No OAuth2 provider configured');
	}
    
	// restrict cookie to current path and children
	cookies.set('google_oauth_provider', JSON.stringify(provider), { path: '' });
	return redirect(302, provider.authURL + PUBLIC_AUTH_REDIRECT_URL);
};
