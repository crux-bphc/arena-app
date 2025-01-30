import type { EventsRecord, StandingsRecord, TeamsRecord } from './pocketbase';

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

type EventsRecordWithStandings = EventsRecord & {
	teams: TeamsRecord[];
	standings?: StandingsRecordWithTeam[];
};
