import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }: { fetch: Function }) => {
    let res = await fetch("/user/bet/api/newbet");
    if (res.status == 308) redirect(308, '/login')
    let events = await res.json();
    return { events };
};