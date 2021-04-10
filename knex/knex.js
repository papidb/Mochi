import knex from 'knex';
import knexConfig from '../knexfile.js';

const environment = process.env.ENVIRONMENT || 'development';

const config = knexConfig[environment];

// knex(config).schema.createTable(tableName, function (table) {
//   table.increments('id').primary().unsigned();
//   table.double('balance').notNullable();
//   table.string();
//   table.string('password');
//   table.timestamp('created_at').defaultTo(knex.fn.now());
// });

export default knex(config);
