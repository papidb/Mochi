import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import Logger from './logger';
import knex from '../../knex/knex';
import config from '../config';

export default async ({ expressApp }) => {
  await dependencyInjectorLoader({
    knex,
  });
  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('🤤 Express loaded');
};
