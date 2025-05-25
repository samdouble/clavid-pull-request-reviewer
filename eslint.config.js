import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['node_modules/*']),
  {
    rules: {
      'prefer-const': 'error',
			semi: 'error',
		},
	},
]);
