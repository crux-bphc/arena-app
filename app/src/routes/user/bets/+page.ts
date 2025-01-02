import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// Something is wrong with this? Or at least it does not seem to work on my device
export const load: PageLoad = async ({ fetch }: { fetch: Function }) => {
    let res = await fetch("/api/user/bets/?open=true");
    if (res.status == 308)
        return redirect(308, '/login')
    let bets = await res.text();
    return { bets };
};