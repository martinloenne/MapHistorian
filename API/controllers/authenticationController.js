const asyncController = require('../middleware/asyncHandler');
const config = require('../config.js');
const userModel = require('../models/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendMail = require('../mailer.js')


// Create token
const sendTokenResponse = (User, statusCode, res) => {
  const token = User.getSignedJwtToken();   // Method we have in the user Model
  const tokenOptions = {
    expires: new Date(
      Date.now() + config.JWT.jwtCookieExpire * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true
  };
  res.status(statusCode).cookie('token', token, tokenOptions).json({
    success: true,
    token
  });
};

// Make new User
// route(POST): auth/register/
exports.register = asyncController(async(req,res,next) => {
  const { email, password } = req.body;
  // Create a new user
  const newUser = await userModel.create({
    email,
    password
  });
  sendTokenResponse(newUser, 200, res);
});


// Login User
// route(POST): auth/login/
exports.login = asyncController(async(req,res,next) => {
  console.log("Someone is logging in ...")
  const { email, password } = req.body; // Get request from body
  // Validate null
  if (!password || !email ) {
    return res.status(400).json({message: 'Credentials Invalid', method: req.method});
  }
  // Find user in db
  const user = await userModel.findOne({ email }).select('+password');
  // User not exist
  if (!user) {
    return res.status(401).json({message: 'Credentials Invalid', method: req.method});
  }
  // Check password
  if (! await user.matchUserPassword(password)) {
    return res.status(401).json({message: 'Credentials Invalid', method: req.method});
  }
  // If ok, send Token back
  sendTokenResponse(user, 200, res);
});

// Logout User
// route(GET): auth/logout/
exports.logout = asyncController(async(req,res,next) => {
  res.cookie('token','none',{expires: new Date(Date.now() + 10 * 1000), httpOnly: true});
  res.status(200).json({success: true, message: 'User logged out', data:{}});
});


// Verify Authentication
// route(POST): auth/verify/
exports.verifyAuth = asyncController(async(req,res,next) => {
  let token;
  // Header token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) 
  {
    token = req.headers.authorization.split(' ')[1];
    console.log("Stringify auth: ", JSON.stringify(req.headers.authorization));
  }

  if (req.headers.authorization) 
  {
    token = req.headers.authorization;
    //console.log("Stringify auth: ", JSON.stringify(req.headers.authorization));
  }

  if (!token)  // Make sure token exists
  {
    console.log("No token")
    return res.status(401).json({message: 'Not allowed to access this route, sorry!', method: req.method});
  }

  try  // Verify token
  {
    const decoded = jwt.verify(token, config.JWT.jwtSecret);
    req.user = await userModel.findById(decoded.id);  // Puts user into our request
    //res.send(decoded);
    res.status(200).send({
      success: true,
      decoded,
      user: req.user,
    });
    //return res.status(202).json({message: decoded, method: req.method});
    //next();
  } 
  catch (err) 
  {
    res.status(401).send({
      success: false
    });
    //return res.status(401).json({message: err, method: req.method});
    //return res.status(401).json({message: 'Not allowed to access this route, sorry!', method: req.method});
  }
});

// Logout User
// route(GET): auth/logout/
exports.logout = asyncController(async(req,res,next) => {
  res.cookie('token','none',{expires: new Date(Date.now() + 10 * 1000), httpOnly: true});
  res.status(200).json({success: true, message: 'User logged out', data:{}});
});

// Authenticated change password
exports.updateUserPassword = asyncController(async(req,res,next) => {
  const User = await userModel.findById(req.user.id).select('+password');
  if (! await User.matchUserPassword(req.body.currentUserPassword)) {
    return res.status(401).json({message: 'incorrect password', method: req.method});
  }
  User.password = req.body.newUserPassword;
  await User.save();
  sendTokenResponse(User, 200, res);
});

// Password reset by providing token
exports.resetPasswordByToken = asyncController(async (req, res, next) => {
  // hashed token
  const resetUserPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
  // Find user by reset token
  const user = await userModel.findOne({resetUserPassToken: resetUserPasswordToken, resetUserPassExpiration: { $gt: Date.now() }});
  // If there does not exist a user with reset token return error
  if (!user) {
    return res.status(400).json({message: 'Token is invalid', method: req.method});
  }
  // Else we save the new provided password
  user.password = req.body.password;
  // Sets token reset token back to null
  user.resetUserPassToken = undefined;
  user.resetUserPassExpiration = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});


// Request password reset
exports.requestPasswordReset = asyncController(async (req, res, next) => {
  const user = await userModel.findOne({email: req.body.email});
  if (!user) 
  {
    return res.status(404).json({message: 'We found no user with that email', method: req.method});
  }
  // Get reset token
  const resetToken = user.resetToken();
  await user.save({ validateBeforeSave: false });

  const mailContent = {
    from: '"MapHistorian" <74c4cf4623-a5cf36@inbox.mailtrap.io>',
    to: user.email,
    subject: 'MapHistorian Password reset',
    text: 'Maphistorian password reset', 
    html: `<b>Hey there! </b><br> You requested to reset your password, so here is the link to reset it! <br> ${req.get('host')}/reset?token=${resetToken}`
  };

  try 
  {
    const result = sendMail(mailContent);
    if (result == false) {

    }
  } 
  catch (error) 
  {    
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(404).json({message: 'Something went wrong with sending the email'});
  }
  return res.status(200).json({success: true, message: 'Email sent', data:{}});
});