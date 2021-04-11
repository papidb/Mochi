const { Knex } = require('knex');
const transactionTypes = require('../../src/config/transactions');
const transactions = Object.keys(transactionTypes).map(token => transactionTypes[token]);
const tableName = 'transactions';

/**
 * setup db
 * @param {Knex} knex
 * @returns {Promise<Knex.SchemaBuilder>}
 */
exports.up = function (knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments('id').primary().unsigned();
    table.double('amount').defaultTo(0);
    table.integer('user').references('users.id').unsigned().index().onDelete('CASCADE');
    table.integer('to_user').references('users.id').unsigned().index().onDelete('CASCADE');
    table.enum('type', transactions);
    table.boolean('status');
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
