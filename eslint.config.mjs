import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 🌐 Client-side (browser)
  {
    files: ["public/**/*.{js,mjs}"],
    languageOptions: {
      globals: globals.browser,
    },
    ...js.configs.recommended, // ✅ use recommended rules
  },

  // 🖥️ Server-side (Node)
  {
    files: ["server.js", "app.js", "routes/**/*.js"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
    },
    ...js.configs.recommended, // ✅ use same recommended rules
  },
]);
