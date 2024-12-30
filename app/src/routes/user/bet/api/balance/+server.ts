import { json, type RequestHandler } from '@sveltejs/kit';
import { getBalance } from '$lib/server/database'

const handlePOST: RequestHandler = async ({ locals }: { locals: any }) => {
    const userid = locals.user?.id
    
    if (userid == null)
        return new Response('', { status: 308 })
    
    try {
        const balance = await getBalance(userid);
        return json({ balance });
    } catch(error) {
        return json(error)
    }
};

export const POST = handlePOST;