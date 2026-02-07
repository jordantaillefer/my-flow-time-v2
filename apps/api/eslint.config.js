import js from '@eslint/js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores(['dist', '.wrangler']),
	{
		files: ['**/*.{ts,tsx}'],
		extends: [js.configs.recommended, tseslint.configs.recommended],
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
	},
]);
