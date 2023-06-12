module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 9,
        sourceType: 'module',
        ecmaFeatures: {
            modules: true,
            jsx: true,
        },
    },

    ignorePatterns: [
        'node_modules/',
        'dist/',
        'dist-prod/',
        'build/',
        'coverage/',
        'benchmark/',
        'scripts/',
        'docs/',
    ],

    settings: {
        react: {
            version: 'detect',
        },
    },

    extends: ['eslint:recommended', 'prettier'],

    plugins: [
        '@typescript-eslint',
        'prettier',
        'es5',
    ],

    rules: {
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'prefer-arrow/prefer-arrow-functions': 'error',

        'es5/no-typeof-symbol': 'error',
        'no-unused-vars': ['warn', {
            argsIgnorePattern: '^_',
        }],

        'prettier/prettier': ['error', {
            singleQuote: true,
            arrowParens: 'avoid',
            trailingComma: 'es5',
        }],
    },

    overrides: [
        {
            extends: ['plugin:@typescript-eslint/recommended'],
            files: ['*.ts'],
            rules: {
                '@typescript-eslint/no-unused-vars': ['error', {
                    argsIgnorePattern: '^_',
                }],
            },
        },

        {
            extends: ['plugin:@typescript-eslint/recommended','plugin:react/recommended'],
            files: ['*.tsx'],
            plugins: ['react-hooks'],
            rules: {
                'react-hooks/rules-of-hooks': 'error',
                'react-hooks/exhaustive-deps': 'warn',
                'react/react-in-jsx-scope': 'off',
                'react/prop-types': 'off',
                'react/no-children-prop': 'off',
            },
        },

        {
            files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
            globals: { vi: true },
            rules: {
                '@typescript-eslint/ban-ts-comment': 'off',
                'react-hooks/rules-of-hooks': 'off',
                'react-hooks/exhaustive-deps': 'off',
                'es5/no-for-of': 'off',
                'es5/no-generators': 'off',
                'es5/no-typeof-symbol': 'off',
            }
        }
    ],
};
