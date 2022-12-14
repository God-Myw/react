const { strictEslint } = require('@umijs/fabric');

module.exports = {
  ...strictEslint,
  globals: {
    APP_TYPE: true,
    page: true,
  },
};
