import { Router } from 'express';
import { checkSchema } from 'express-validator';
// import { promisify } from 'node:util';
// import jwt from 'jsonwebtoken';
import InputValidator from '../models/InputValidator.js';
// import RoleAccounts from '../models/RoleAccounts.js';
import Errors from '../models/Errors.js';
import Accounts from '../models/Accounts.js';
import Pagination from '../models/Pagination.js';
import dotenv from 'dotenv';
dotenv.config();

const route = Router();
const secretKey = process.env.NODE_ENV === 'production' ? process.env.PROD_SECRET_KEY : process.env.DEV_SECRET_KEY;
const inputValidator = new InputValidator();
// const roleAccount = new RoleAccounts();
const account = new Accounts();
const error = new Errors();

route.get(
  '/find-all',
  checkSchema({
    auth: {
      ...inputValidator.authSchema()
    },
    page: {
      isInt: { bail: true },
      optional: true,
      trim: true,
      errorMessage: 'Query Page is not valid'
    },
    limit: {
      isInt: { bail: true },
      optional: true,
      trim: true,
      errorMessage: 'Query Limit is not valid'
    }
  }),
  error.inputValidation.bind(error),
  async (req, res, next) => {
    try {

    }
    catch (error) {
      next(error);
    }
  },
  account.read.bind(account),
  (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const data = res.locals.dataAllAccount;
    const pagination = new Pagination(data, page, limit);
    res.status(200).json(pagination.view());
  }
);

route.post(
  '/find-by-id',
  checkSchema({
    auth: {
      ...inputValidator.authSchema()
    },
    id_account: {
      ...inputValidator.idSchema(),
      errorMessage: "ID Account is not valid"
    }
  }),
  error.inputValidation.bind(error),
  async (req, res, next) => {
    try {
      // Decoding JWT
      const decoded = verifyAsync(req.cookies.auth, secretKey);
      
      // Comparing role user
      if (decoded.role_name_account !== 'webmaster' || decoded.role_name_account !== 'admin') {
        const error = new Error('Account is not authorized');
        error.status = 401;
        throw error;
      }

      next();
    }
    catch (error) {
      next(error);
    }
  },
  account.readByID.bind(account),
  (req, res) => {
    res.status(200).json(res.locals.dataAccount);
  }
);

/*
route.post(
  '/add-new',
  checkSchema({
    auth: {
      ...inputValidator.authSchema()
    },
    id_account: {
      ...inputValidator.idSchema(),
      errorMessage: 'ID Account is not valid'
    },
    id_employee: {
      ...inputValidator.idSchema(),
      errorMessage: 'ID Employee is not valid'
    },
    username: {
      ...inputValidator.regularSchema(),
      trim: true,
      errorMessage: 'Username is not valid'
    },
    password: {
      ...inputValidator.passSchema()
    },
    id_role_account: {
      ...inputValidator.idSchema(),
      errorMessage: 'ID Role Account is not valid'
    }
  }),
  error.inputValidation.bind(error),
  async (req, res, next) => {
    try {
      // Decoding JWT
      const decoded = verifyAsync(req.cookies.auth, secretKey);

      // Comparing role user
      if (decoded.role_name_account !== 'webmaster' || decoded.role_name_account !== 'admin') {
        const error = new Error('Account is not authorized');
        error.status = 401;
        throw error;
      }

      next();
    }
    catch (error) {
      next(error);
    }
  },
  account.create.bind(account),
  (req, res) => {
    res.status(200).json(res.locals.createNewAccount);
  }
);
*/

/*
route.put(
  '/edit',
  checkSchema({
    auth: {
      ...inputValidator.authSchema()
    }
  }),
  error.inputValidation.bind(error),
  async (req, res, next) => {
    try {
      // Decoding JWT
      const decoded = verifyAsync(req.cookies.auth, secretKey);

      // Comparing role user
      if (decoded.role_name_account !== 'webmaster' || decoded.role_name_account !== 'admin') {
        const error = new Error('Account is not authorized');
        error.status = 401;
        throw error;
      }

      next();
    }
    catch (error) {
      next();
    }
  }
);
*/

export default route;
