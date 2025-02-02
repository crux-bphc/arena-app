// formats time in a nice format
export function formatTime(time: string) {
	const date = new Date(time);

	let hours = date.getUTCHours();
	const mins = date.getUTCMinutes();
	const ampm = hours >= 12 ? 'pm' : 'am';

	hours = hours % 12; // Convert to 12-hour format
	hours = hours ? hours : 12; // the hour '0' should be '12'
	// Format minutes to always be two digits
	const formattedMins = mins < 10 ? '0' + mins : mins;

	return `${hours}:${formattedMins} ${ampm}`;
}
// gets how much time left in a nice string
export function getTimeLeft(time: string) {
	const currentTime = new Date().getTime() + 1000 * 60 * 330;
	const startTime = new Date(time).getTime();
	const diff = Math.floor((startTime - currentTime) / (1000 * 60));

	const hrString = diff >= 60 ? `${Math.floor(diff / 60)}hr ` : '';
	return `${hrString}${diff % 60} min`;
}
// gets user's balance
export async function getBalance() {
	try {
		const res = await fetch('/api/user/balance');
		const { balance: bal }: { balance: number } = await res.json();

		return bal;
	} catch (error) {
		console.log('Failed to get user balance, error:', error);
		return 0;
	}
}
