const { body, validationResult } = require('express-validator');

const validateSignup = [
  body('name').notEmpty().withMessage('Full name is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateSignin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const validate = (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateSignup,
  validateSignin,
  validate,
}; 