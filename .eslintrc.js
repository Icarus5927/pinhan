module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", ],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "space-before-function-paren": 0,
    indent: ["off", 2],
    quotes: [1, "single"],
    semi: 0,
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  }
};
