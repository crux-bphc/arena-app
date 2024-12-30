import { json, type RequestHandler } from '@sveltejs/kit';
import { betTeam, getEvents, getTeams } from '$lib/server/database'

const handlePOST: RequestHandler = async ({ request, locals }: { locals: any, request: Request }) => {
    const { name, event, title, coins } = await request.json();
    const userid = locals.user?.id;

    if (userid == null) 
        return new Response('', { status: 308 })

    // The client has requested for the available teams
    if (title != null) {
        try {
            const res = await getTeams(userid, title);
            return json(res);
        } catch(error) {
            return json(error)
        }    
    }
    
    // The client has requested for all events
    try {
        const res = await betTeam(name, userid, coins, event);
        return json(res);
    } catch(error) {
        return json(error)
    }
};

// Should this not 'redirect'?
const handleGET: RequestHandler = async ({ locals }: { locals: any }) => {
    const userid = locals.user?.id;

    if (userid == null)
        return new Response('', { status: 308 })

    return json(await getEvents())

}

export const GET = handleGET;
export const POST = handlePOST;
