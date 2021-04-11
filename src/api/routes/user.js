import { Router } from 'express';
import { Container } from 'typedi';
import Models from '../../models';
import httpStatus from 'http-status';
import * as UserService from '../../services/user.service';
import * as authService from '../../services/auth.service';
import * as tokenService from '../../services/token.service';
import auth from '../../middlewares/auth';

const { User } = Models;

const route = Router();

export default app => {
  app.use('/users', route);

  route.get('/', auth(), async (req, res, next) => {
    const logger = Container.get('logger');
    try {
      const limit = 50;
      let { size = 20 } = req.query;
      size = Number(size);
      console.log(req.user);
      const users = await User.findAll().limit(limit);
      return res.status(200).json({ data: users, limit, size });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });
  route.get('/search', async (req, res, next) => {});

  route.delete('/', async (req, res, next) => {
    const logger = Container.get('logger');
    try {
      const { id } = req.body;
      const user = await UserService.deleteUserById(id);
      return res.json({
        ok: true,
        message: 'User deleted',
        user,
      });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });
  route.post('/login', async (req, res, next) => {
    const logger = Container.get('logger');
    try {
      const { username, password } = req.body;
      const user = await authService.loginUserWithUsernameAndPassword(username, password);
      const tokens = await tokenService.generateAuthTokens(user);
      return res.json({ user, tokens });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });
  route.post('/logout', async (req, res, next) => {
    const logger = Container.get('logger');
    try {
      console.log(req.body);
      await authService.logout(req.body.refreshToken);
      return res.status(httpStatus.NO_CONTENT).send();
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });

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
