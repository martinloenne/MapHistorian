const asyncController = require('./asyncHandler');
const config = require('../config');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

// Protect auth routes, does not allow access to route if not authenticated
const isAuthProtected = asyncController(async(req,res,next) => {
  console.log("Running auth middleware ...");
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

  if (!token)  // Make sure token exists
  {
    return res.status(401).json({message: 'Not allowed to access this route, sorry!', method: req.method});
  }

  try  // Verify token
  {
    const decoded = jwt.verify(token, config.JWT.jwtSecret);
    req.user = await userModel.findById(decoded.id);  // Puts user into our request
    console.log(req.user);
    next();
  } 
  catch (err) 
  {
    return res.status(401).json({message: err, method: req.method});
    //return res.status(401).json({message: 'Not allowed to access this route, sorry!', method: req.method});
  }
});

module.exports = isAuthProtected;