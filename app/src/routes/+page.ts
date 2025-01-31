import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }: { fetch: Function }) => {
    try {
        const res = await fetch('/api/events?priority=true');
        if (res.status === 308) {
            throw redirect(308, '/login');
        } else if (!res.ok) {
            console.error(`Failed to fetch events data: ${res.status}`);
            return;
        }
        const events = (await res.json())?.events;
        return { events };
    } catch (e) {
        console.error(`Failed to fetch events data: ${e}`);
    }
};