onRecordUpdate(async (e) => {
    console.log('update')
    throw new BadRequestError("BAD REQUEST");
}, "events", "standings", "teams");