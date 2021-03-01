const express = require('express');
const expressRouter = express.Router();
const isAuthProtected = require('../middleware/authProtectedRoute');
const authHelper = require('../middleware/authHelper');
const validator = require('../middleware/validate');
const model = require('../models/pin');
const crudController = require('../controllers/crudController');
const rateLimit = require("express-rate-limit");

const apiLimiterLoggedIn = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 1,  // limit each IP to 100 requests per windowMs
	message:
	"Too many pins created from this IP, please try again after an 1 minute"
  });
const apiLimiterLoggedOut = rateLimit({
	windowMs: 1 * 60 * 90000, // 90 minutes
	max: 1,  // limit each IP to 100 requests per windowMs
	message:
		"To create more than one pin a day, please create an account😊 This is to prevent spamming😑"
});

expressRouter.get('/me', isAuthProtected, crudController.getAuthUserModel(model));
expressRouter.get('/', authHelper, crudController.getQuery(model));
expressRouter.post('/', validator.validate('none'), isAuthProtected, apiLimiterLoggedIn, crudController.create(model));
expressRouter.post('/guest', validator.validate('none'), apiLimiterLoggedOut, crudController.createWithoutAuth(model));
expressRouter.route('/:id')
						.get(crudController.get(model))
						.put(isAuthProtected, crudController.update(model))
						.delete(isAuthProtected, crudController.delete(model));

module.exports = expressRouter;