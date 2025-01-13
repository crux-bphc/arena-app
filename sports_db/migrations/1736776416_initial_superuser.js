migrate(
	(db) => {
		if ($os.getenv('SPORTS_PB_SUPERUSER_EMAIL') && $os.getenv('SPORTS_PB_SUPERUSER_PASSWORD')) {
			let superusers = db.findCollectionByNameOrId('_superusers');
            let record = new Record(superusers);
            
			record.set('email', $os.getenv('SPORTS_PB_SUPERUSER_EMAIL'));
			record.set('password', $os.getenv('SPORTS_PB_SUPERUSER_PASSWORD'));

			db.save(record);
		}
	},
	(_) => {}
);
