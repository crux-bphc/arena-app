declare module '$env/static/public' {
	export const PUBLIC_AUTH_REDIRECT_URL: string;
	export const PUBLIC_PB_URL: string;
}

declare module '$env/static/private' {
	export const DEBUG: boolean;
	export const PB_URL: string;
	export const PB_SUPERUSER_EMAIL: string;
	export const PB_SUPERUSER_PASSWORD: string;
}
