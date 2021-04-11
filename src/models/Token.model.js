import createModel from '../helpers/models';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

const name = 'Token';
const tableName = 'tokens';

// Properties that are allowed to be selected from the database for reading.
const selectableProps = ['id', 'token', 'user', 'type', 'blacklisted', 'expires', 'created_at'];

const initModel = () => {
  const guts = createModel({
    name,
    tableName,
    selectableProps,
  });

  return guts;
};

export default initModel;
