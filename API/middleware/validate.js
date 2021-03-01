const { body } = require('express-validator')

// Yet to be implemented
exports.validate = (method) => {
  switch (method) {
    case 'toBeImplemented': {
     return [ 
        //body('userName').exists(),
        //body('email', 'Invalid email').exists().isEmail(),
       ]   
		}
		case 'someProp': {
			return [ 
				 body('name', 'No name').exists()
			]   
		}
		case 'AnotherProp': {
			return [ 
				 body('category', 'No category').exists(),
				 body('type', 'No type').exists(),
				 body('time', 'No time').exists()	
			]   
		 }
		 case 'none': {
			return [ 
			]   
		 }
	}
}