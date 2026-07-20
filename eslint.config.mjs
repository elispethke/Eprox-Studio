import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  // Architectural boundaries: the feature-based layering is enforced by the
  // linter, not by convention. Features expose a public API via index.ts
  // (schema.ts is an additional deliberate contract for server consumers);
  // internals are only reachable from inside the same feature.
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "import/resolver": { typescript: { alwaysTryTypes: true } },
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        {
          type: "feature",
          pattern: "src/features/*",
          mode: "folder",
          capture: ["featureName"],
        },
        { type: "shared", pattern: "src/shared/**" },
        { type: "lib", pattern: "src/lib/**" },
        { type: "types", pattern: "src/types/**" },
        { type: "test", pattern: "src/test/**" },
        { type: "root-file", pattern: "src/*.ts", mode: "file" },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "app",
              allow: ["app", "feature", "shared", "lib", "types"],
            },
            {
              from: "feature",
              allow: ["feature", "shared", "lib", "types", "test"],
            },
            { from: "shared", allow: ["shared", "lib", "types"] },
            { from: "lib", allow: ["lib", "types"] },
            { from: "test", allow: ["shared", "lib", "feature", "types"] },
            { from: "root-file", allow: ["shared", "lib", "types"] },
            { from: "types", allow: ["lib"] },
          ],
        },
      ],
      "boundaries/entry-point": [
        "error",
        {
          default: "disallow",
          rules: [
            // Non-feature elements have no gate.
            {
              target: ["app", "shared", "lib", "types", "test", "root-file"],
              allow: "**",
            },
            // Features are consumed through their public surface only…
            { target: ["feature"], allow: ["index.ts", "schema.ts"] },
            // …except from inside the same feature, where anything goes.
            {
              target: [["feature", { featureName: "${from.featureName}" }]],
              allow: "**",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
