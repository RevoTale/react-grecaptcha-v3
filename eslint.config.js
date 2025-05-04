import { defineConfig } from "eslint/config";

import love from 'eslint-config-love'

export default defineConfig([
  { ...love,
    files: ["./src/**/*.{js,mjs,cjs,ts,jsx,tsx}"]

  },
]);