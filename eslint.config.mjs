import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import babelParser from "@babel/eslint-parser";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended"
  ),
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["next/babel"],
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      react,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react/react-in-jsx-scope": "off", // Disable React import requirement
      "react/prop-types": "off", // Disable PropTypes validation
      "jsx-a11y/label-has-associated-control": "warn", // Downgrade to warning
      "jsx-a11y/click-events-have-key-events": "warn", // Downgrade to warning
      "jsx-a11y/no-static-element-interactions": "warn", // Downgrade to warning
      "@next/next/no-img-element": "warn", // Downgrade to warning
      "react/no-unknown-property": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];