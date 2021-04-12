import { Container } from 'typedi';
import LoggerInstance from './logger';
import config from '../config';

export default ({ knex, paystack }) => {
  try {
    Container.set('knex', knex);
    LoggerInstance.info('🤤 knex injected into container');

    Container.set('logger', LoggerInstance);
    LoggerInstance.info('🤤 Logger injected into container');

    Container.set('paystack', paystack);
    LoggerInstance.info('🤤 Paystack injected into container');
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
