const asyncController = require('./asyncHandler');
const config = require('../config');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

// Checks for authentication, but does not return error if not authenticated, gives the controller the user signed-in
const isAuth = asyncController(async(req,res,next) => {
  let token;
  // Header token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) 
  {
    token = req.headers.authorization.split(' ')[1];
  }

  if (req.headers.authorization) 
  {
    token = req.headers.authorization;
  }

  if (token)  // Make sure token exists
  {
    try  // Verify token
    {
      const decoded = jwt.verify(token, config.JWT.jwtSecret);
      //console.log("Verifying: ", decoded);
      req.user = await userModel.findById(decoded.id);  // Puts user into our request
      next();
    } 
    catch (err) 
    {
      return res.status(401).json({message: err, method: req.method});
      //return res.status(401).json({message: 'Not allowed to access this route, sorry!', method: req.method});
    }
  } else {
    next();
  }
});

module.exports = isAuth;