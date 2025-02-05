const unauthenticatedRoutePrefixes = [
	'/(auth)/',
	'/api/event/',
	'/api/events/',
	'/api/user/leaderboard'
];

export const needsAuth = (routeId: string | undefined | null) =>
	!unauthenticatedRoutePrefixes.some((prefix) => routeId?.startsWith(prefix));

// calling new Date() converts recieved date to local time -> So the +5:30 must be subtracted
export const getDate = (dateString: IsoDateString) => {
    // IST is UTC + 5:30
    return new Date((new Date(dateString)).getTime() - 5.5 * 60 * 60 * 1000)
}