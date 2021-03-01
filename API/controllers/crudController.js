const asyncController = require('../middleware/asyncHandler');
const { validationResult } = require('express-validator');


// Get specified model
exports.get = (model) => asyncController(async(req,res,next) => {   // Need a try catch
  const result = await model.findById(req.params.id);
  if (!result) 
  {
    return res.status(404).json({status: `Not found by id of ${req.params.id}`});
  }
  res.status(200).json({ success: true, data: result });
});


// Get the models only assosiated with the user authenticated
exports.getAuthUserModel = (model) => asyncController(async(req,res,next) => {   
	console.log("GetAuthUserModel: ", model);
	const result = await model.find({ user: { $in: [ req.user._id ] } });
	if (!result) 
	{		
			return res.status(404).json({status: `Not found by id of ${req.params.id}`});
	}
	res.status(200).json({ success: true, data: result });
});


// Get model by query
exports.getQuery = (model) =>  asyncController(async(req,res,next) => {   // Need a try catch	
	var reqQuery;

	// From user
	if(req.user){
		reqQuery = { $or:[ {...req.query}, {user: req.user._id}]};
	}else {
		reqQuery = {...req.query};
	}
	
	// From and to date
	if (req.query.from && req.query.to) {		
		const from = new Date(req.query.from.split(',').join(' ')).toISOString();
		const to = new Date(req.query.to.split(',').join(' ')).toISOString();
		const queryDate = {
			createdAt: {
				$gt: from,
				$lt: to
			}
    	}
		reqQuery = {...reqQuery, queryDate}
	};

	await model.find(reqQuery, function (err, entries) 
	{
		if(err){
			console.log(err);
			return res.status(404).json({status: `Something went wrong with your query request`});
		}
		res.status(201).json({amount: entries.length, entries: entries});    
	}).populate('votes'); // Populated with votes to get all pins and their votes		
	

});


// Create model without being authenticated
exports.createWithoutAuth = (model) => asyncController(async(req,res,next) => {   
	const err = validationResult(req);
	if (!err.isEmpty()) 
	{
		res.status(422).json({ err: err.array() });
		return;
	}
	
	// Create project from body
	const result = await model.create(req.body);

	// Send back
	res.status(201).json({
		success: true,
		data: result
	});
});


// Create model when authenticated
exports.create = (model) => asyncController(async(req,res,next) => {   

	const err = validationResult(req);
	if (!err.isEmpty()) 
	{
		res.status(422).json({ err: err.array() });
		return;
	}

	// Add user to req.body
	console.log("User ID: "+ req.user._id);

	req.body.user = req.user._id;

	console.log(req.body.name)

	// Create project from body
	//const result = await model.create(req.body);

	await model.create(req.body, function (err, entries) 
	{
		if(err){
			console.log(err);
			return res.status(404).json({status: `Something went wrong with your query request`});
		}
			// Send back
		res.status(201).json({
			success: true,
			data: entries
		}); 
	});			



});


// Update model
exports.update = (model) => asyncController(async(req,res,next) => {   

	let result = await model.findById(req.params.id);
	console.log(result);
	if (!result) {
    	return res.status(404).json({status: `Not found by id of ${req.params.id}`});
	}

	console.log("req.user._id ", req.user._id);
	console.log(" result.user.toString()", result.user.toString());
	// Verify ownership	
	if (result.user.toString() !== req.user._id.toString()) {
		console.log("Not found");
		return res.status(404).json({status: `This is not your kort to update!`});
	}
	
	result = await model.findByIdAndUpdate(req.params.id, req.body, 
	{
		new: true,  // Returns the new updated entry
		runValidators: true  // False by default, run validators
	});
	console.log(result);
	res.status(200).json({ success: true, data: result });
});


// Delete model
exports.delete = (model) => asyncController(async(req,res,next) => {
	const result = await model.findById(req.params.id);
  if (!result) {
    return res.status(404).json({status: `Not found by id of ${req.params.id}`});
  }

  if (result.user.toString() !== req.user._id) {
		return res.status(404).json({status: `This is not your project to delete!`});
  }
  await model.remove();
  res.status(200).json({ success: true, data: {} });
});