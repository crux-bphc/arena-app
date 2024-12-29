import PocketBase from 'pocketbase';
import { type Handle } from '@sveltejs/kit';
import { PB_URL } from '$env/static/private';
import type { TypedPocketBase } from '$lib/types/pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(PB_URL) as TypedPocketBase;
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		if (event.locals.pb.authStore.isValid) {
			const { record: user } = await event.locals.pb.collection('users').authRefresh();
			event.locals.user = user;
		}
	} catch (err) {
		console.error(err);
		event.locals.pb.authStore.clear();
	}

	const response = await resolve(event);

	// apparently browsers don't like mixing redirects with cookies with SameSite=Strict
	// https://github.com/pocketbase/pocketbase/discussions/903#discussioncomment-4369424
	// is this a security risk? probably not, SameSite=Lax sends cookies mainly for top-level redirects (like users clicking on links).
	// since the only external link in our application is the google oauth2 redirect, it should be fine, but it is still worth noting.
	response.headers.append(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ sameSite: 'Lax' })
	);
	return response;
};
