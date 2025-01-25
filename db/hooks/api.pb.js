routerAdd("POST", "/api/collection/create", (e) => {
  try {
    let new_record = e.requestInfo().body;

    const error = require(`${__hooks}/validate.js`).validate(new_record);
    if (error != null) return e.json(400, { message: error });

    // Create a new record
    const collection = $app.findCollectionByNameOrId(new_record.collectionName);
    delete new_record.collectionName;
    delete new_record.collectionId;
    const record = new Record(collection);
    for (let [key, value] of Object.entries(new_record)) record.set(key, value);
    $app.save(record);
  } catch (error) {
    // Normally no error should occur?
    console.error("Error creating record", JSON.stringify(new_record), error);
    return e.error(500, error);
  }

  return e.json(200, {});
});

routerAdd("POST", "/api/collection/update", (e) => {
  try {
    const updated_record = e.requestInfo().body;

    const error = require(`${__hooks}/validate.js`).validate(updated_record);
    if (error != null) return e.json(400, { message: error });

    // Update an existing record
    const record = $app.findRecordById(
      updated_record.collectionName,
      updated_record.id
    );
    delete updated_record.collectionName;
    delete updated_record.collectionId;
    for (let [key, value] of Object.entries(updated_record))
      record.set(key, value);
    $app.save(record);
  } catch (error) {
    console.error(
      "Error updating record",
      JSON.stringify(updated_record),
      error
    );
    return e.error(500, error);
  }

  return e.json(200, {});
});

routerAdd("POST", "/api/collection/delete", (e) => {
  try {
    const delete_record = e.requestInfo().body;
    const record = $app.findRecordById(
      delete_record.collectionName,
      delete_record.id
    );
    $app.delete(record);
  } catch (error) {
    console.error(
      "Error deleting record",
      JSON.stringify(delete_record),
      error
    );
    return e.error(500, error);
  }

  return e.json(200, {});
});
