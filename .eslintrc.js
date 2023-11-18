module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    warnOnUnsupportedTypeScriptVersion: false,
    sourceType: "module",
  },
  plugins: ["unused-imports", "simple-import-sort"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "simple-import-sort/imports": "warn",
    "prefer-const": "warn",
    "no-redeclare": "warn",
    "no-console": "warn",
  },
  env: {
    es6: true,
  },
  overrides: [
    {
      files: ["functions/**/*.ts?(x)", "src/**/*.ts?(x)"],
      rules: {
        "no-console": "off",
      },
    },
  ],
  ignorePatterns: ["!getv.js"],
};
