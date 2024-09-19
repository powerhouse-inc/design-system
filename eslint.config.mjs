// @ts-check

import { default as eslint } from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import tailwind from 'eslint-plugin-tailwindcss';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// const compat = new FlatCompat({
//     baseDirectory: import.meta.dirname,
// });

// 'eslint:recommended',
// 'plugin:react/recommended',
// 'plugin:react-hooks/recommended',
// 'plugin:@typescript-eslint/strict-type-checked',
// 'plugin:@typescript-eslint/stylistic-type-checked',
// 'plugin:storybook/recommended',
// 'plugin:tailwindcss/recommended',
// 'plugin:prettier/recommended',

export default tseslint.config(
    eslint.configs.recommended,
    reactPlugin.configs.flat.all,
    reactPlugin.configs.flat['jsx-runtime'],
    ...tseslint.configs.stylisticTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tailwind.configs['flat/recommended'],
    eslintPluginPrettierRecommended,
    {
        ignores: ['node_modules/', 'dist/', 'build/', 'storybook-static/'],
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
            tailwindcss: {
                callees: [
                    'classnames',
                    'clsx',
                    'ctl',
                    'twMerge',
                    'twJoin',
                    'mergeClassNameProps',
                ],
            },
        },
        rules: {
            "react/jsx-filename-extension": [1, { "extensions": [".tsx", ".ts"] }],
            '@typescript-eslint/unbound-method': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/use-unknown-in-catch-callback-variable': 'warn',
            '@typescript-eslint/restrict-plus-operands': 'warn',
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowNumber: true,
                },
            ],
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/consistent-type-imports': 'off',
            '@typescript-eslint/array-type': 'off',
            '@typescript-eslint/prefer-function-type': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': 'off',
            '@typescript-eslint/no-confusing-void-expression': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'warn',
            '@typescript-eslint/no-unnecessary-type-parameters': 'warn',
        },
    },
);
