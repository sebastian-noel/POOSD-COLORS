export default {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["node_modules/**"],
  rules: {
    // Existing DOM IDs use both camelCase and kebab-case in HTML and JavaScript.
    "selector-id-pattern": "^[a-z][a-zA-Z0-9-]*$",
  },
};
