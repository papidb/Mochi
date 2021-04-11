const { Knex } = require('knex');
const tokenTypes = require('../../src/config/tokens');
const tokens = Object.keys(tokenTypes).map(token => tokenTypes[token]);
const tableName = 'tokens';

/**
 * setup db
 * @param {Knex} knex
 * @returns {Promise<Knex.SchemaBuilder>}
 */
exports.up = function (knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments('id').primary().unsigned();
    table.string('token').notNullable();
    table.integer('user').references('users.id').unsigned().index().onDelete('CASCADE');
    table.enum('type', tokens);
    table.boolean('blacklisted').notNullable();
    table.timestamp('expires');
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
