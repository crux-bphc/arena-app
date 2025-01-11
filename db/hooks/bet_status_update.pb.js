onRecordUpdate((e) => {
  if (!e.record.getBool("standingsUpdated")) {
    return e.next();
  }

  // unfortunately pocketbase admin UI doesn't support showing timestamps in local time and defaults to UTC
  // i don't think it's realistic or convenient to expect them to convert local time to UTC while adding events
  // so this means a lot of reverse timezone shenanigans will be needed in the frontend too
  let now = new Date(new Date().getTime() + 1000 * 60 * 330);

  let events = $app.findAllRecords(
    "events",
    $dbx.exp("endTime < {:now}", { now: now.toISOString().replace("T", " ") })
  );

  for (const event of events) {
    let winners = $app
      .findAllRecords(
        "standings",
        $dbx.exp("position == 1 AND event == {:id}", { id: event.id })
      )
      .map((standing) => standing.get("team"));

    let bets = $app.findAllRecords(
      "bets",
      $dbx.exp("event == {:id}", { id: event.id })
    );

    let wonBets = bets.filter((bet) => winners.includes(bet.get("team")));

    let betPools = $app.findAllRecords(
      "betPool",
      $dbx.exp("event == {:id}", { id: event.id })
    );

    let totalPool = 0;
    let wonPool = 0;

    // one passTM
    for (const betPool of betPools) {
      totalPool += betPool.getInt("pool");
      if (winners.includes(betPool.get("team")))
        wonPool += betPool.getInt("pool");
    }

    for (const bet of wonBets) {
      let amount = bet.getInt("amount");
      let payout = Math.floor((amount * totalPool) / wonPool);

      // not using the user expands on bets since it might have stale data (which means money could be disappearing)
      // does this make things safe from race conditions? i hope so
      let user = $app.findRecordById("users", bet.get("user"));
      user.set("balance", user.getInt("balance") + payout);
      $app.save(user);
    }
  }

  e.next();
}, "events");
