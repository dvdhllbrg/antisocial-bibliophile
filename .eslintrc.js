module.exports = {
  extends: [
    'airbnb-typescript',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // suppress errors for missing 'import React' in files since next.js handles this for us.
    "react/react-in-jsx-scope": "off",
    "react/require-default-props": "off",
    "max-len": ["warn", {
      "code": 200,
    }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/label-has-associated-control": ["error", { assert: "either" } ]
  }
};