onRecordUpdate((e) => {
  const event = e.record;

  if (!event.getBool("standingsUpdated")) {
    if (event.original().getBool("standingsUpdated")) {
      throw new BadRequestError("Cannot unset standingsUpdated! Bet payouts have already been triggered!");
    }
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

  const winners = $app.findAllRecords(
    "standings",
    $dbx.exp("position == 1 AND event == {:id}", { id: event.id })
  );

  if (!winners.length) {
    throw new BadRequestError(
      "Failed to trigger bet payout: No winners found!"
    );
  }

  e.next();
}, "events");
