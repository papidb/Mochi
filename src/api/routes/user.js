import { Router } from 'express';
import { Container } from 'typedi';
import Models from '../../models';
const { User } = Models;
import config from '../../config';
// const q = faunadb.query;
// const client = new faunadb.Client({ secret: config.fuanadbKey });

// import middlewares from '../middlewares';
const route = Router();

export default app => {
  app.use('/users', route);

  route.get('/', async (req, res, next) => {
    const logger = Container.get('logger');
    try {
      const limit = 50;
      let { size = 20 } = req.query;
      size = Number(size);
      const users = await User.findAll().limit(limit);
      return res.status(200).json({ data: users, limit, size });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });
  route.get('/search', async (req, res, next) => {});

  route.post('/signup', async (req, res) => {
    const logger = Container.get('logger');
    try {
      const user = await User.create({
        ...req.body,
        balance: 0,
      });
      const realUser = await User.findById(user[0]);
      return res.json({
        ok: true,
        message: 'User created',
        user: realUser,
      });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });
};
