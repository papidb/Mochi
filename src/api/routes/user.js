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
      const users = [];
      const from = await User.from();
      console.log({ from });
      // const newUsers = await User.from();
      return res.status(200).json({ users });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });
  route.get('/search', async (req, res, next) => {
    const logger = Container.get('logger');
    // const client = Container.get('client');
    // const q = Container.get('q');
    try {
      let { size = 20, text } = req.query;
      size = Number(size);
      const posts = await client.query(q.Paginate(q.Documents(q.Collection('posts')), { size }));
      return res.status(200).json({ posts: posts });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });

  route.post('/', async (req, res) => {
    const logger = Container.get('logger');
    const client = Container.get('client');
    const q = Container.get('q');
    try {
      const post = {
        ...req.body,
        createdAt: new Date(),
        photos: [],
        // userId: "user",
      };
      const faunaPosts = await client.query(q.Create(q.Collection('posts'), { data: post }));
      return res.json({ post, message: 'Post Created!' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });
};
