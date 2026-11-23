import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextCoreWebVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      // TODO(#736): restore to "error" once existing effects are refactored
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);
