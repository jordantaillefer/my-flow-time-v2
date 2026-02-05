import { z } from 'zod';

const d1Schema = z.object({
	DB_MODE: z.literal('d1'),
	CLOUDFLARE_ACCOUNT_ID: z.string().min(1, 'CLOUDFLARE_ACCOUNT_ID is required for D1 mode'),
	CLOUDFLARE_DATABASE_ID: z.string().min(1, 'CLOUDFLARE_DATABASE_ID is required for D1 mode'),
	CLOUDFLARE_D1_TOKEN: z.string().min(1, 'CLOUDFLARE_D1_TOKEN is required for D1 mode'),
});

const localSchema = z.object({
	DB_MODE: z.literal('local'),
	LOCAL_DB_PATH: z.string().min(1, 'LOCAL_DB_PATH is required for local mode'),
});

const envSchema = z.discriminatedUnion('DB_MODE', [d1Schema, localSchema]);

export function parseEnv() {
	const dbMode = process.env.DB_MODE || 'd1';
	const rawEnv = {
		...process.env,
		DB_MODE: dbMode,
	};

	const result = envSchema.safeParse(rawEnv);

	if (!result.success) {
		console.error('❌ Environment validation failed:');
		console.error(result.error.format());
		process.exit(1);
	}

	return result.data;
}
