import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import Logger from './logger';
import knex from '../../knex/knex';
import config from '../config';

export default async ({ expressApp }) => {
  /**
   * WTF is going on here?
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */

  await dependencyInjectorLoader({
    knex,
  });
  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('🤤 Express loaded');
};
