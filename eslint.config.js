import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	// Add ignores
	{
		ignores: [
			// Build outputs
			"dist/**",
			// Node modules
			"node_modules/**",
			// Other generated files
			".cache/**",
			".vscode/**",
			".idea/**",
			"*.min.js",
			// Vite/build specific
			"vite.config.js.timestamp-*",
			"vite.config.ts.timestamp-*",
			// Package manager files
			"package-lock.json",
			"yarn.lock",
			"pnpm-lock.yaml",
		],
	},

	// Base JS configurations
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		plugins: { js },
		extends: ["js/recommended"],
		rules: {
			// Remove style rules that Prettier will handle
			// Keep only rules about code quality
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-unused-vars": "warn",
			"no-debugger": "warn",
		},
	},

	// Browser globals with Vite specific additions
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				// Vite specific env vars
				"import.meta": "readonly",
				"process.env": "readonly",
			},
		},
	},

	// TypeScript strict config
	...tseslint.configs.strict,

	// TypeScript rule customizations + tsconfig parsing
	{
		files: ["**/*.{ts,tsx}"],
		extends: [...tseslint.configs.strictTypeChecked],
		languageOptions: {
			parserOptions: {
				project: ["./tsconfig.node.json", "./tsconfig.app.json"],
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/consistent-type-imports": [
				"warn",
				{ prefer: "type-imports" },
			],
		},
	},

	// React configurations
	{
		...pluginReact.configs.flat.recommended,
		files: ["**/*.{jsx,tsx}"],
		rules: {
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",
			"react/jsx-filename-extension": [
				"error",
				{ extensions: [".jsx", ".tsx"] },
			],
			"react/jsx-sort-props": [
				"warn",
				{
					callbacksLast: true,
					shorthandFirst: true,
					ignoreCase: true,
					reservedFirst: true,
				},
			],
			"react/self-closing-comp": "warn",
			"react/jsx-boolean-value": ["warn", "never"],
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},

	// React Hooks
	{
		files: ["**/*.{jsx,tsx}"],
		plugins: {
			"react-hooks": reactHooks,
		},
		rules: {
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
		},
	},

	// JSX A11y (Accessibility)
	{
		...jsxA11y.flatConfigs.recommended,
		files: ["**/*.{jsx,tsx}"],
		plugins: {
			"jsx-a11y": jsxA11y,
		},
	},

	// Import ordering
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		plugins: {
			import: importPlugin,
		},
		rules: {
			"import/order": [
				"warn",
				{
					groups: [
						"builtin",
						"external",
						"internal",
						["parent", "sibling"],
						"index",
						"object",
						"type",
					],
					pathGroups: [
						{
							pattern: "@/**",
							group: "internal",
							position: "before",
						},
					],
					"newlines-between": "always",
					alphabetize: { order: "asc", caseInsensitive: true },
				},
			],
			"import/no-duplicates": "error",
			"import/first": "warn",
			"import/no-cycle": "warn",
		},
	},

	// Vite-specific configurations
	{
		files: ["vite.config.{js,ts}"],
		languageOptions: {
			globals: globals.node,
		},
	},

	// Prettier integration - must be last to override other configs
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		plugins: {
			prettier: eslintPluginPrettier,
		},
		rules: {
			"prettier/prettier": "warn",
			...prettierConfig.rules,
		},
	},
]);
