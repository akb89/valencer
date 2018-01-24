const logger = require('./../logger/logger');

const config = {
  logger: logger.info,
  api: {
    port: 3030,
  },
  databases: {
    server: 'localhost',
    port: 27017,
    names: {
      en: {
        170: 'fn_en_170',
        '170_train_ft': 'fn_en_170_train_ft',
        '170_train_ft_ex': 'fn_en_170_train_ft_ex',
        '170_dev': 'fn_en_170_dev',
      },
      ja: {
        100: 'fn_ja_100',
      },
    },
  },
};

module.exports = config;
