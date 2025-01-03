import PocketBase from 'pocketbase';
import { PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD } from '$env/static/private';
import { PUBLIC_PB_URL } from '$env/static/public';
import type { TypedPocketBase } from '$lib/types/pocketbase';

const pb = new PocketBase(PUBLIC_PB_URL) as TypedPocketBase;
pb.autoCancellation(false);

await pb
	.collection('_superusers')
	.authWithPassword(PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD, { autoRefreshThreshold: 30 * 60 });

export default pb;
