import pb from '$lib/server/database';
import { json, redirect, type RequestHandler } from '@sveltejs/kit';

interface Bet {
    team: string,
    coins: number,
    sport: string,
    updated: Date,
}

async function getUserBets(open: boolean, userid: any): Promise<Bet[]> {
    try {
        const now = Date.now();
        const bets: Bet[] = [];
        const userBets = await pb.collection('bets').getFullList({filter: `userId="${userid}"`});
        for (let { amount, updated, teamId, eventId } of userBets) {
            const { title, startTime } = await pb.collection('events').getFirstListItem(`id="${eventId}"`);
            const { name } = await pb.collection('teams').getFirstListItem(`id="${teamId}"`);
            
            const bet: Bet = { coins: amount, sport: title, team: name, updated: new Date(updated) }
            if (!open && (new Date(startTime).getTime() < now))
                bets.push(bet);
            else if (open && (new Date(startTime).getTime() > now))
                bets.push(bet);
        }
        
        return new Promise((resolve, reject) => { resolve(bets) })
    } catch(error) {
        return new Promise((resolve, reject) => { reject(`Failed to find user with id ${userid}`) })
    }
}

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