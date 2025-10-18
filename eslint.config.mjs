import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 🌐 For client-side JS (browser)
  {
    files: ["public/**/*.{js,mjs}"],
    languageOptions: {
      globals: globals.browser,
    },
    extends: ["js/recommended"],
  },

  // 🖥️ For server-side JS
  {
    files: ["server.js", "app.js", "routes/**/*.js"],
    languageOptions: {
      globals: globals.node, // 👈 enables __dirname, require, etc.
      sourceType: "commonjs",
    },
    extends: ["js/recommended"],
  },
]);
