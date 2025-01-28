import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { needsAuth } from '$lib/auth';

export const load: LayoutLoad = async ({ route, data }) => {
    if (needsAuth(route.id) && !data.user) {
        return redirect(302, '/login');
    }
	return { user: data.user };
};
