import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { getUserBets } from '$lib/server/database'

// Could be post I guess
const handleGET: RequestHandler = async ({ locals }: { locals: any }) => {
    const userid = locals.user?.id;

    if (userid != null) {
        // Get the bets from the database
        const bets = await getUserBets(false, userid);
        // Return JSON containing the bet data
        return json(bets)
    } else {
        return new Response('', { status: 308 })
    }
}

export const GET = handleGET;