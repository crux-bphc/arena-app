migrate(
	(db) => {
		if ($os.getenv('PB_SUPERUSER_EMAIL') && $os.getenv('PB_SUPERUSER_PASSWORD')) {
			let superusers = db.findCollectionByNameOrId('_superusers');
            let record = new Record(superusers);
            
			record.set('email', $os.getenv('PB_SUPERUSER_EMAIL'));
			record.set('password', $os.getenv('PB_SUPERUSER_PASSWORD'));

			db.save(record);
		}
	},
	(_) => {}
);
