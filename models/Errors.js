import { validationResult } from 'express-validator';

class Errors {
  constructor() { }

  inputValidation(req, res, next) {
    // Error Input Validation
    try {
      validationResult(req).throw();
      next();
    }
    catch (error) {
      const err = error.array({ onlyFirstError: true }).map(item => item.msg).join(", ");      
      const errObj = new Error(err);
      errObj.status = 403;

      next(errObj);
    }
  }
}

export default Errors;