import { Container } from 'typedi';
import LoggerInstance from './logger';
import config from '../config';

export default ({ q: knexQuery }) => {
  try {
    Container.set('q', knexQuery);
    LoggerInstance.info('🤤 Fuana injected into container');

    Container.set('logger', LoggerInstance);
    LoggerInstance.info('🤤 Agenda injected into container');
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
