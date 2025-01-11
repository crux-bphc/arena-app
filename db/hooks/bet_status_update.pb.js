onRecordUpdate((e) => {
  const event = e.record;
  if (!event.getBool("standingsUpdated")) {
    return e.next();
  }

  const winners = $app
    .findAllRecords(
      "standings",
      $dbx.exp("position == 1 AND event == {:id}", { id: event.id })
    )
    .map((standing) => standing.get("team"));

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

    // not using the user expands on bets since it might have stale data (which means money could be disappearing)
    // does this make things safe from race conditions? i hope so
    const user = $app.findRecordById("users", bet.get("user"));
    user.set("balance", user.getInt("balance") + payout);
    $app.save(user);
  }

  e.next();
}, "events");
