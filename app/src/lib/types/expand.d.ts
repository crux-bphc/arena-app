import type { BetPoolRecord, EventsRecord, StandingsRecord, TeamsRecord } from './pocketbase';

export type BetExpand = {
	event: EventsResponse;
	team: TeamsResponse;
};

export type StandingsExpand = {
	event: EventsResponse;
	team: TeamsResponse;
};

type StandingsRecordWithTeam = StandingsRecord & {
	team: TeamsRecord;
};

// this is the data type for sports page events
type EventRecWithStandAndBet = Omit<EventsRecord, 'teams'> & {
	teams: TeamsRecord[];
	standings?: StandingsRecordWithTeam[];
	betPools?: BetPoolRecord[];
	userCount?: number;
};
