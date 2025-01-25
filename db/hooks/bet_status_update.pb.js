onRecordUpdate((e) => {
	const event = e.record;
	if (!event.getBool("standingsUpdated")) {
		return e.next();
	}

	// unfortunately pocketbase admin UI doesn't support showing timestamps in local time and defaults to UTC
	// i don't think it's realistic or convenient to expect them to convert local time to UTC while adding events
	// so this means a lot of reverse timezone shenanigans will be needed in the frontend too
	let now = new Date(new Date().getTime() + 1000 * 60 * 330);

	if (now / 1000 < e.record.getDateTime("endTime").unix()) {
		throw new BadRequestError(
			"Failed to trigger bet payout: Event has not ended yet!"
		);
	}

	const winners = $app
		.findAllRecords(
			"standings",
			$dbx.exp("position == 1 AND event == {:id}", { id: event.id })
		)
		.map((standing) => standing.get("team"));

	if (!winners.length) {
		throw new BadRequestError(
			"Failed to trigger bet payout: No winners found!"
		);
	}

	const bets = $app.findAllRecords(
		"bets",
		$dbx.exp("event == {:id}", { id: event.id })
	);

	const wonBets = bets.filter((bet) => winners.includes(bet.get("team")));

	const betPools = $app.findAllRecords(
		"betPool",
		$dbx.exp("event == {:id}", { id: event.id })
	);

	let totalPool = 0;
	let wonPool = 0;

	// one passTM
	for (const betPool of betPools) {
		totalPool += betPool.getInt("amount");
		if (winners.includes(betPool.get("team")))
			wonPool += betPool.getInt("amount");
	}

	if (wonPool === 0) {
		return e.next();
	}

	for (const bet of wonBets) {
		const amount = bet.getInt("amount");
		const payout = Math.floor((amount * totalPool) / wonPool);
		bet.set("payout", payout);
		$app.save(bet);

		// not using the user expands on bets since it might have stale data (which means money could be disappearing)
		// does this make things safe from race conditions? i hope so
		const user = $app.findRecordById("users", bet.get("user"));
		user.set("balance", user.getInt("balance") + payout);
		$app.save(user);
	}

	e.next();
}, "events");
