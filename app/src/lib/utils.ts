const unauthenticatedRoutePrefixes = [
	'/(auth)/',
	'/api/event/',
	'/api/events/',
	'/api/user/leaderboard'
];

export const needsAuth = (routeId: string | undefined | null) =>
	!unauthenticatedRoutePrefixes.some((prefix) => routeId?.startsWith(prefix));
