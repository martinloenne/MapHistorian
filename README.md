# Map Historian - REST API with Express.js Backend and React Frontend

Crowd-Sourced map of historic locations and events.
I made this site in order to create an overview over historic locations. Both because of interest but also in the future would like to travel to these locations.
Right now this site only contains historic locations and events from the Classical Antiquity-Era but in the future hopefully expand to cover other eras as well.

## Functionality
- CRUD operations on the API
- Authentication from front-end to backend
- Register a user
- Map that displays pins from the API
- Creation of pins as authenticated and non-authenticated user
- Implemented MongoDB database
- Voting system
- Admin Approval system
- Reset password by email
- Custom middleware that for example controls authentication on API
- Validation
- Better security
- And more :o)


## Deployment

Live at https://maphistorianv1.herokuapp.com/
Can take some time to load if the server is idle, just wait for it to start up.
Testing account you can use:
Username: test@test.dk
Password: test123123

## Built With

- REST API with Express.js in Node.js.
  - Tried to build the backend as much as possible by myself to learn and therefore not using libaries for things like authentication.
  - MongoDB database
- React frontend.
  - Used the react-map-gl libary to display the map.

### Todo

- Ability to delete your own pins
- Ability for others to edit your pins and update them
- Admin panel
- Confirmation email
- Able to change vote
- More alerts and error handling
