import knex from 'knex';
import knexConfig from '../knexfile.js';

const environment = process.env.ENVIRONMENT || 'development';

const config = knexConfig[environment];

export default knex(config);
