import type { TypedPocketBase, UsersResponse } from '$lib/types/pocketbase';
import { type AuthProviderInfo } from 'pocketbase';

declare global {
	namespace App {
		interface Locals {
			pb: TypedPocketBase;
			user?: UsersResponse;
		}
	}
}

export {};
