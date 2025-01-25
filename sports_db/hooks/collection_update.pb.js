// Global functions are not allowed, so a module export is used
onRecordUpdate(
  (e) => require(`${__hooks}/send.js`).send(e, "update"),
  "events",
  "standings",
  "teams"
);

onRecordCreate(
  (e) => require(`${__hooks}/send.js`).send(e, "create"),
  "events",
  "standings",
  "teams"
);

onRecordDelete(
  (e) => require(`${__hooks}/send.js`).send(e, "delete"),
  "events",
  "standings",
  "teams"
);

// Using the standard collection event hooks do not allow migrations to occur
// However, using the `...Request` variants do allow migrations to occur but still guard against any changes made from the web UI
onCollectionCreateRequest((_) => {
  throw new BadRequestError("Unauthorized attempt to create a new collection!");
});

onCollectionDeleteRequest((_) => {
  throw new BadRequestError("Unauthorized attempt to delete collection!");
});

onCollectionUpdateRequest((_) => {
  throw new BadRequestError("Unauthorized attempt to change collection!");
});
