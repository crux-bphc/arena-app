import PocketBase, { type AuthProviderInfo } from 'pocketbase';

declare global {
	namespace App {
		interface Locals {
			pb: PocketBase;
		}
	}
}

export {};
