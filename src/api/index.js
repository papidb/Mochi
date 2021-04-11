import { Router } from 'express';
import user from './routes/user';
import transactions from './routes/transactions';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  user(app);
  transactions(app);

  return app;
};
