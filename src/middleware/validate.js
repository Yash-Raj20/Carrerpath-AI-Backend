import { validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));
    return res.status(400).json({
      errors: extractedErrors,
    });
  }
  next();
};

export default validate;