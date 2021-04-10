import fs from 'fs';
import path from 'path';
import knex from '../../knex/knex';
import UserModel from './User.model';

const getModelFiles = dir =>
  fs
    .readdirSync(dir)
    .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
    .map(file => path.join(dir, file));

// Gather up all model files (i.e., any file present in the current directory
// that is not this file) and export them as properties of an object such that
// they may be imported using destructuring like
// `const { MyModel } = require('./models')` where there is a model named
// `MyModel` present in the exported object of gathered models.
const files = getModelFiles(__dirname);

// const models = files.reduce((modelsObj, filename) => {
//   const initModel = require(filename).default;
//   const model = initModel(knex);

//   if (model) modelsObj[model.name] = model;

//   return modelsObj;
// }, {});

const models = {
  User: UserModel(knex),
};

export default models;

// export const User =  UserModel(knex).catch(err => console.error({err})),
