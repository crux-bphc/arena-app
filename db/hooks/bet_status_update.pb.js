// TODO: Move this to sports-db <OR> validate in router when events gets changed
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
    throw new BadRequestError("Failed to trigger bet payout: Event has not ended yet!");
  }

  const winners = $app
    .findAllRecords(
      "standings",
      $dbx.exp("position == 1 AND event == {:id}", { id: event.id })
    )
    .map((standing) => standing.get("team"));
  
  if (!winners.length) {
    throw new BadRequestError("Failed to trigger bet payout: No winners found!");
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

routerAdd('POST', '/api/collection/create', (e) => {
    try {
        let new_record = e.requestInfo().body;

        const error = require(`${__hooks}/validate.js`).validate(new_record);
        if (error != null)
            return e.json(400, { message: error });
        
        // Create a new record
        const collection = $app.findCollectionByNameOrId(new_record.collectionName);
        delete new_record.collectionName;
        delete new_record.collectionId;
        const record = new Record(collection)
        for (let [key, value] of Object.entries(new_record))
            record.set(key, value);
        $app.save(record);
    } catch(error) {
        // Normally no error should occur?
        console.error('Error creating record', JSON.stringify(new_record), error);
        return e.error(500, error);
    }

    return e.json(200, {});
})

routerAdd('POST', '/api/collection/update', (e) => {
    try {
        const updated_record = e.requestInfo().body;

        const error = require(`${__hooks}/validate.js`).validate(updated_record);
        if (error != null)
            return e.json(400, { message: error });

        // Update an existing record
        const record = $app.findRecordById(updated_record.collectionName, updated_record.id);
        delete updated_record.collectionName;
        delete updated_record.collectionId;
        for (let [key, value] of Object.entries(updated_record))
            record.set(key, value);
        $app.save(record);

    } catch(error) {
        console.error('Error updating record', JSON.stringify(updated_record), error);
        return e.error(500, error);
    }

    return e.json(200, {});
})

routerAdd('POST', '/api/collection/delete', (e) => {
    try {
        const delete_record = e.requestInfo().body;
        const record = $app.findRecordById(delete_record.collectionName, delete_record.id);
        $app.delete(record);
    } catch(error) {
        console.error('Error deleting record', JSON.stringify(delete_record), error);
        return e.error(500, error);
    }

    return e.json(200, {});
})