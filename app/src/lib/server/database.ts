import { building } from '$app/environment';
import PocketBase from 'pocketbase';
import { INTERNAL_PB_URL, PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD } from '$env/static/private';
import type { TypedPocketBase } from '$lib/types/pocketbase';

const pb = new PocketBase(INTERNAL_PB_URL) as TypedPocketBase;
pb.autoCancellation(false);

if (!building) {
	await pb
		.collection('_superusers')
		.authWithPassword(PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD, { autoRefreshThreshold: 30 * 60 });
}

export default pb;
