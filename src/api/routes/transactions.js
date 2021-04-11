import { Router } from 'express';
import { Container } from 'typedi';
import Models from '../../models';
import httpStatus from 'http-status';
import * as UserService from '../../services/user.service';
import * as authService from '../../services/auth.service';
import * as tokenService from '../../services/token.service';
import * as transactionService from '../../services/transaction.service';
import auth from '../../middlewares/auth';
import transactionTypes from '../../config/transactions';
import ApiError from '../../utils/ApiError';

const { Transaction } = Models;

const route = Router();

export default app => {
  app.use('/transactions', route);

  route.get('/', auth(), async (req, res, next) => {
    const logger = Container.get('logger');
    try {
      const user = req.user;
      const transactions = await transactionService.getTransactionsByUserId(user.id);
      return res.status(200).json({ transactions });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });

  route.post('/transfer', auth(), async (req, res, next) => {
    const logger = Container.get('logger');
    try {
      const user = req.user;
      const { username, amount } = req.body;
      if (user.balance < amount) throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Insufficient amount in account');

      const toUser = await UserService.getUserByUsername(username);
      const userId = user.id;
      const toUserId = toUser.id;

      const rawTransaction = transactionService.createTransaction(amount, userId, toUserId, transactionTypes.TRANSFER);
      const id = (await Transaction.create(rawTransaction))[0];
      let initialTransaction = Object.assign(rawTransaction, { id });

      await Transaction.transfer(userId, toUserId, initialTransaction.id, amount).catch(error => {
        throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, "Couldn't transfer money");
      });

      initialTransaction.status = true;
      return res.status(httpStatus.CREATED).json({ toUser, transaction: initialTransaction });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });
};
