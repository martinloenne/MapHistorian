const express = require('express');
const expressRouter = express.Router();
const isAuthProtected = require('../middleware/authProtectedRoute');
const validator = require('../middleware/validate');
const model = require('../models/vote');
const crudController = require('../controllers/crudController');
const rateLimit = require("express-rate-limit");

const apiLimiterLoggedOut = rateLimit({
	windowMs: 1 * 1 * 90000, // 90 minutes
	max: 1,  // limit each IP to 100 requests per windowMs
	message:
		"To create more than one pin a day, please create an account😊 This is to prevent spamming😑"
});

expressRouter.post('/', validator.validate('none'), isAuthProtected, crudController.create(model));
expressRouter.post('/guest', validator.validate('none'), apiLimiterLoggedOut, crudController.createWithoutAuth(model));

module.exports = expressRouter;