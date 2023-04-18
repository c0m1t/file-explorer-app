/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
module.exports = {
  endOfLine: "lf",
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
  ],
  importOrderCombineTypeAndValueImports: true,
  importOrderMergeDuplicateImports: true,
  importOrderSortSpecifiers: true,
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
};
