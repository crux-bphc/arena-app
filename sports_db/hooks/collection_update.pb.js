// Global functions are not allowed, so a module export is used
onRecordUpdate((e) => require(`${__hooks}/send.js`).send(e, 'update'), 'events', 'standings', 'teams');

onRecordCreate((e) => require(`${__hooks}/send.js`).send(e, 'create'), 'events', 'standings', 'teams');

onRecordDelete((e) => require(`${__hooks}/send.js`).send(e, 'delete'), 'events', 'standings', 'teams');

// If a user tries to modify any part of the pre-determined collections,
// an error is produced
// Note that these event hooks do not allow migrations to occur, and must be removed when migrating
onCollectionCreate((_) => {
    throw new BadRequestError('Unauthorized attempt to create a new collection!');
});

onCollectionDelete((_) => {
    throw new BadRequestError('Unauthorized attempt to delete collection!');
});

onCollectionUpdate((_) => {
    throw new BadRequestError('Unauthorized attempt to change collection!');
});