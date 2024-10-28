import { validationResult } from 'express-validator';
import StorageSettings from './StorageSettings.js';

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

  inputValidationWithMulter(req, res, next) {
    // Error Input Validation
    try {
      validationResult(req).throw();
      next();
    }
    catch (error) {
      const err = error.array({ onlyFirstError: true }).map(item => item.msg).join(", ");      
      const errObj = new Error(err);
      errObj.status = 403;

      const storageSettings = new StorageSettings();
      const files = req.files;
      const converted = Object.values(files).flat();
      converted.forEach((item) => { storageSettings.removeFile(item.path) });

      next(errObj);
    }
  }
}

export default Errors;