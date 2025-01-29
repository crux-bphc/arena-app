export type BetExpand = {
	event: EventsResponse;
	team: TeamsResponse;
};

export type StandingsExpand = {
	event: EventsResponse;
	team: TeamsResponse;
};

type EventsRecordWithStandings = EventsRecord & {
	standings?: StandingsRecord[];
};
