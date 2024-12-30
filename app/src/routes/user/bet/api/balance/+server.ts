import { DEBUG } from '$env/static/private';
import pb from '$lib/server/database';
import { json, type RequestHandler } from '@sveltejs/kit';

async function getBalance(userid: any): Promise<number> {
    try {

        const { balance } = await pb.collection('users').getFirstListItem(`id="${userid}"`)

        return new Promise((resolve, reject) => resolve(balance))
    } catch(error) {
        if (DEBUG) console.log('An error occured when trying to obtain the balance of user', userid, 'Error:', error)
        return new Promise((resolve, reject) => reject(-1))
    }
}

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