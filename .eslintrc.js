module.exports = {
  "extends": "airbnb",
  "installedESLint": true,
  "parser": "babel-eslint",
  "plugins": [
    "flowtype",
  ],
  "rules": {
    "import/no-unresolved": "off",
    "sort-imports": "warn",
    "no-trailing-spaces": "warn",
    "consistent-return": "error",
    "no-param-reassign": [
      "error",
      {
        "props": false,
      },
    ],
    "no-underscore-dangle": [
      "error",
      {
        "allowAfterThis": true,
      },
    ],
    "no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
      },
    ],
    "new-cap": "off",
    "default-case": "off",
    "flowtype/define-flow-type": "error",
    "flowtype/require-valid-file-annotation": [
      "error",
      "always",
    ],
    "flowtype/space-after-type-colon": "error",
    "flowtype/use-flow-type": "error",
  },
};
