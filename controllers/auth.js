import { Router } from 'express';
import { checkSchema } from 'express-validator';
import InputValidator from '../models/InputValidator.js';
import Errors from '../models/Errors.js';
import Auth from '../models/Auth.js';

const route = Router();
const inputValidator = new InputValidator();
const auth = new Auth();
const error = new Errors();

route.post(
  '/sign-in',
  checkSchema({
    username: {
      ...inputValidator.regularSchema(),
      trim: true,
      errorMessage: 'Username is not valid'
    },
    password: {
      ...inputValidator.passSchema()
    }
  }),
  error.inputValidation.bind(error),
  auth.signIn.bind(auth),
  (req, res) => {
    res.cookie('auth', res.locals.token, { httpOnly: true });
    res.status(200).json({ message: 'Token created' });
  }
);

export default route;
