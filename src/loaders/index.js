import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import Logger from './logger';
import knex from '../../knex/knex';
import Paystack from 'paystack';
import config from '../config';

const paystack = Paystack(config.paystack.sk);

export default async ({ expressApp }) => {
  await dependencyInjectorLoader({
    knex,
    paystack,
  });
  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('🤤 Express loaded');
};
