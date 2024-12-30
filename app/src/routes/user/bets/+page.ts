import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }: { fetch: Function }) => {
    let res = await fetch("/user/bets/api/open");
    if (res.status == 308)
        return redirect(308, '/login')
    let bets = await res.json();
	return { bets };
};