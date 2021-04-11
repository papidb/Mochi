import { Knex } from 'knex';
const tableName = 'users';

/**
 * setup db
 * @param {Knex} knex
 * @returns {Promise<Knex.SchemaBuilder>}
 */
exports.up = function (knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments('id').primary().unsigned();
    table.double('balance').notNullable();
    table.string('username', 32).unique().index();
    table.string('password');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * drop database
 * @param {Knex} knex
 * @returns {Promise<Knex.SchemaBuilder>}
 */
exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
