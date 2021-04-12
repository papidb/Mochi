import bcrypt from 'bcrypt';
import createModel from '../helpers/models';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

const name = 'User';
const tableName = 'users';

// Properties that are allowed to be selected from the database for reading.
// (e.g., `password` is not included and thus cannot be selected)
const selectableProps = ['id', 'username', 'balance', 'created_at'];

// Bcrypt functions used for hashing password and later verifying it.
const SALT_ROUNDS = 10;
const hashPassword = password => bcrypt.hash(password, SALT_ROUNDS);
const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

// Always perform this logic before saving to db. This includes always hashing
// the password field prior to writing so it is never saved in plain text.
const beforeSave = user => {
  if (!user.password) return Promise.resolve(user);

  // `password` will always be hashed before being saved.
  return hashPassword(user.password)
    .then(hash => ({ ...user, password: hash }))
    .catch(err => `Error hashing password: ${err}`);
};

const initModel = knex => {
  const guts = createModel({
    // knex,
    name,
    tableName,
    selectableProps,
  });
  // // create table 'users' with a primary key using 'increments()'
  // await knex.schema.createTable(tableName, function (table) {
  //   table.increments('id').primary().unsigned();
  //   table.double('balance').notNullable();
  //   table.text('username').unique().index();
  //   table.string('password');
  //   table.timestamp('created_at').defaultTo(knex.fn.now());
  // });

  // Augment default `create` function to include custom `beforeSave` logic.
  const create = props => beforeSave(props).then(user => guts.create(user));

  const verify = async (username, password) => {
    const matchErrorMsg = 'Incorrect username or password';

    const user = await knex.select().from(tableName).where({ username }).first().timeout(guts.timeout);
    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, matchErrorMsg);
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) throw new ApiError(httpStatus.UNAUTHORIZED, matchErrorMsg);
    return user;
  };

  return {
    ...guts,
    create,
    verify,
  };
};

export default initModel;
