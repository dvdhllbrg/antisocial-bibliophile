module.exports = {
  extends: [
    'airbnb-typescript',
    'plugin:@next/next/recommended',
  ],
  ignorePatterns: [".eslintrc.js", "public/*"],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  plugins: [
    'import',
    'jsx-a11y',
    'react',
    'react-hooks'
  ],
  rules: {
    // suppress errors for missing 'import React' in files since next.js handles this for us.
    "react/react-in-jsx-scope": "off",
    "react/require-default-props": "off",
    "max-len": ["off"],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/label-has-associated-control": ["error", { assert: "either" } ],
  },
};