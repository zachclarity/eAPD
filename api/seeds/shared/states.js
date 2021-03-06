const chalk = require('chalk');
const logger = require('../../logger')('state seeder');
const { states } = require('../../util/states');

exports.seed = async knex => {
  logger.info(`Begging to seed the ${chalk.cyan('states')} table`);
  const total = await knex('states')
    .count('id')
    .first();
  logger.info(`${chalk.cyan('states')} table currently has ${total.count}`);
  if (total.count.toString() === '0') {
    await knex('states').insert(states);
    logger.info(`Completed seeding the ${chalk.cyan('states')} table`);
  } else {
    logger.info(`Skipping seeding the ${chalk.cyan('states')} table`);
  }
};
