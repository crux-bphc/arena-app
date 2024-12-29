migrate(
  (db) => {
    if ($os.getenv("GOOGLE_CLIENT_ID") && $os.getenv("GOOGLE_CLIENT_SECRET")) {
		let collection = db.findCollectionByNameOrId("users");
		collection.passwordAuth.enabled = false;
		collection.oauth2.enabled = true;
		collection.oauth2.mappedFields.name = "name";
		collection.oauth2.mappedFields.avatarURL = "avatar";
		collection.oauth2.providers = [
			{
				name: "google",
				clientId: $os.getenv("GOOGLE_CLIENT_ID"),
				clientSecret: $os.getenv("GOOGLE_CLIENT_SECRET"),
			},
		];
		db.save(collection);
    }
  },
  (_) => {}
);
