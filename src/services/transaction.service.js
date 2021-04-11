import httpStatus from 'http-status';
import Models from '../models';
import ApiError from '../utils/ApiError';
const { Transaction } = Models;

/**
 * Get transactions belonging to user by id
 * @param {ObjectId} id
 * @returns {Promise<Transaction>}
 */
export const getTransactionsByUserId = async id => Transaction.find({ user: id });

export const createTransaction = (amount, user, to_user, type, status = false) => ({
  amount,
  user,
  to_user,
  type,
  status,
});
