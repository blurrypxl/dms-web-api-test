class InputValidator {
  constructor() { }

  authSchema() {
    return {
      isString: { bail: true },
      isEmpty: false,
      trim: true,
      errorMessage: 'User is not authorized'
    };
  }
  
  idSchema() {
    return {
      isString: { bail: true },
      isLength: { options: { min: 8, max: 8 } },
      isEmpty: false,
      trim: true
    };
  }

  passSchema() {
    return {
      isString: { bail: true },
      isEmpty: false,
      trim: true,
      errorMessage: 'Password is not valid'
    };
  }

  regularSchema() {
    return {
      isString: { bail: true },
      isEmpty: false,
    };
  }
}

export default InputValidator;