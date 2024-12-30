import PocketBase from 'pocketbase'
import { type EventsRecord } from '$lib/types/pocketbase.d.ts';
import { PB_URL, DEBUG, PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD } from '$env/static/private';

const debug = DEBUG;
// Server instance of Pocketbase
const pb = new PocketBase(PB_URL);

async function auth() {
    // PocketBase does not yet know that this is a superuser server
    if (!pb.authStore.isValid) {
        // Copied off of the docs, I don't know if this is the best way to do this
        pb.autoCancellation(false);
        await pb.collection('_superusers').authWithPassword(PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD)
    }
}

// Authenticate the first time
await auth();

interface Bet {
    team: string,
    coins: number,
    sport: string,
    updated: Date,
}

interface Team {
    name: string,
    score: string,
    event: string,
    position: number,
    startTime: Date,
    betAmount: number,
}

// Gets the bets made by the user
export async function getUserBets(open: boolean, userid: any): Promise<Bet[]> {
    try {
        const now = Date.now();
        await auth();
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

// Gets all available events
export async function getEvents(): Promise<EventsRecord[]> {
    try {
        await auth();
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

// Gets the teams registered for a given event
export async function getTeams(userid: any, eventTitle: string): Promise<Team[]> {
    try {
        await auth();

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

// Process bet request
// Are the status codes relavant? (They're not used, but whatever)
export async function betTeam(name: string, userid: any, coins: number, event: string | undefined): Promise<any> {
    const now = Date.now();
    if (debug) console.log(`${userid} is betting on ${name} of event ${event} with coins ${coins}`)
   
    try {
        await auth();

        const prevUser = await pb.collection('users').getFirstListItem(`id="${userid}"`);

        // If the user has less balance than `coins` to bet
        if (prevUser.balance - coins < 0) {
            if (debug) console.log('Balance too low!');
            
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
                        if (debug) console.log('User tried to bet on a closed bet')
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

                    if (debug) console.log('Updated balance for userid', userid, ':', prevUser.balance, 'when betting on team', name, 'in sport', event)
                    
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
                    if (debug) console.log('User tried to bet on a closed bet')
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
            
                if (debug) console.log('Created new bet! Updated balance for userid', userid, ':', prevUser.balance, 'when betting on team', name, 'in sport', event)
                
                return new Promise((resolve, reject) => resolve({ newBalance: prevUser.balance, status: 200 }))
            }
            throw error;
        }
    } catch(error) {
        console.error('An error may have occured when announcing bets? Here is the message:', error);
        return new Promise((resolve, reject) => reject({ error, status: 500 }))
    }
}

// Gets the current balance of the user
export async function getBalance(userid: any): Promise<number> {
    try {
        await auth();

        const { balance } = await pb.collection('users').getFirstListItem(`id="${userid}"`)

        return new Promise((resolve, reject) => resolve(balance))
    } catch(error) {
        if (debug) console.log('An error occured when trying to obtain the balance of user', userid, 'Error:', error)
        return new Promise((resolve, reject) => reject(-1))
    }
}