import { json, type RequestHandler } from '@sveltejs/kit';
import pb from '$lib/server/database'
import type { EventsRecord } from '$lib/types/pocketbase';
import { DEBUG } from '$env/static/private';

interface Team {
    name: string,
    score: string,
    event: string,
    position: number,
    startTime: Date,
    betAmount: number,
}

async function betTeam(name: string, userid: any, coins: number, event: string | undefined): Promise<any> {
    const now = Date.now();
    if (DEBUG) console.log(`${userid} is betting on ${name} of event ${event} with coins ${coins}`)
   
    try {

        const prevUser = await pb.collection('users').getFirstListItem(`id="${userid}"`);

        // If the user has less balance than `coins` to bet
        if (prevUser.balance - coins < 0) {
            if (DEBUG) console.log('Balance too low!');
            
            return new Promise((resolve, reject) => reject({ balanceTooLow: true, status: 400 }))
        }    
        // Try to find out if the user has already bet on the team
        try {
            const userBets = await pb.collection('bets').getFullList({filter: `userId="${userid}"`});
            // Go through all bets created by the user
            for (let { amount, teamId, eventId, id } of userBets) {
                const { name: teamName } = await pb.collection('teams').getFirstListItem(`id="${teamId}"`);
                const { startTime } = await pb.collection('events').getFirstListItem(`id="${eventId}"`);

                // This user has already bet on the given team
                if (name == teamName) {
                    // The user has clicked on a bet that's closed
                    if (now > new Date(startTime).getTime()) {
                        if (DEBUG) console.log('User tried to bet on a closed bet')
                        return new Promise((resolve, reject) => reject({ betClosed: true, status: 409 })) 
                    }
    
                    const data = {
                        userId: userid,
                        amount: amount + coins,
                        eventId,
                        teamId,
                    }

                    // Update user and bet data
                    prevUser.balance -= coins;
                    await pb.collection('bets').update(id, data);
                    await pb.collection('users').update(userid, prevUser);

                    if (DEBUG) console.log('Updated balance for userid', userid, ':', prevUser.balance, 'when betting on team', name, 'in sport', event)
                    
                    return new Promise((resolve, reject) => resolve({ newBalance: prevUser.balance, status: 200 }))
                }
            }
            throw `The user has not yet bet on the team ${name}! Create it, please`;
        } catch(error) {
            if (event != undefined) {
                const { id: teamId } = await pb.collection('teams').getFirstListItem(`name="${name}"`);
                const { id: eventId, startTime } = await pb.collection('events').getFirstListItem(`title="${event}"`);

                // The user has clicked on a bet that's closed
                if (now > new Date(startTime).getTime()) {
                    if (DEBUG) console.log('User tried to bet on a closed bet')
                    return new Promise((resolve, reject) => reject({ betClosed: true, status: 409 })) 
                }

                const data = {
                    userId: userid,
                    amount: coins,
                    eventId,
                    teamId,
                }

                // Update user data and create bet data
                prevUser.balance -= coins;
                await pb.collection('users').update(userid, prevUser);
                await pb.collection('bets').create(data);
            
                if (DEBUG) console.log('Created new bet! Updated balance for userid', userid, ':', prevUser.balance, 'when betting on team', name, 'in sport', event)
                
                return new Promise((resolve, reject) => resolve({ newBalance: prevUser.balance, status: 200 }))
            }
            throw error;
        }
    } catch(error) {
        console.error('An error may have occured when announcing bets? Here is the message:', error);
        return new Promise((resolve, reject) => reject({ error, status: 500 }))
    }
}

async function getEvents(): Promise<EventsRecord[]> {
    try {
        const eventData = await pb.collection('events').getFullList();
        const events: EventsRecord[] = [];

        // Go through all avalilable events and add it to the events array
        for (let { sport, title, description, startTime, endTime, location, id } of eventData) {

            const newEvent: EventsRecord = {
                description,
                startTime,
                location,
                endTime,
                sport,
                title,
                id, // Not neccessary, just to satisfy the types
            }

            events.push(newEvent);
        }

        return new Promise((resolve, reject) => { resolve(events) })

    } catch(error) {
        return new Promise((resolve, reject) => { reject(`Failed to get events! ${error}`) })
    }
}

async function getTeams(userid: any, eventTitle: string): Promise<Team[]> {
    try {
        const standings = await pb.collection('standings').getFullList();
        const teams: Team[] = [];
        // Go through all avalilable teams and add it to the teams array
        for (let { teamId, eventId, score, position } of standings) {

            const { name } = await pb.collection('teams').getFirstListItem(`id="${teamId}"`);
            const { title, startTime } = await pb.collection('events').getFirstListItem(`id="${eventId}"`);
            let betAmount = 0;

            try {
                const { amount } = await pb.collection('bets').getFirstListItem(`userId="${userid}" && teamId="${teamId}" && eventId="${eventId}"`);
                betAmount = amount;
            } catch(error) { }

            const teamData: Team = { name, event: title, startTime, score, position, betAmount: (betAmount ?? 0) }

            if (title == eventTitle)
                teams.push(teamData);
        }

        return new Promise((resolve, reject) => { resolve(teams) })

    } catch(error) {
        return new Promise((resolve, reject) => { reject(`Failed to get teams! ${error}`) })
    }
}

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
