// import { Knex } from 'knex';
const { Knex } = require('knex');

import createModel from '../helpers/models';

const name = 'Transaction';
const tableName = 'transactions';

// Properties that are allowed to be selected from the database for reading.
const selectableProps = ['id', 'amount', 'user', 'to_user', 'type', 'status', 'created_at'];

/**
 *
 * @param {Knex} knex
 */

const initModel = knex => {
  const guts = createModel({
    name,
    tableName,
    selectableProps,
  });

  const transfer = async (from, to, transactionId, amount) => {
    const transferTransaction = await knex.transaction();

    try {
      await knex('users').transacting(transferTransaction).where({ id: from }).decrement('balance', amount);
      await knex('users').transacting(transferTransaction).where({ id: to }).increment('balance', amount);
      await knex(tableName).transacting(transferTransaction).where({ id: transactionId }).update({ status: true });
      await transferTransaction.commit();
    } catch (error) {
      await transferTransaction.rollback();
      throw error;
    }
  };
  return { ...guts, transfer };
};

export default initModel;
