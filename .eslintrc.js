require("@rushstack/eslint-patch/modern-module-resolution");
module.exports = {
  root: true,
  extends: ["lostfictions/react"],
  parserOptions: { tsconfigRootDir: __dirname },
};
