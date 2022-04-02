# DevConnector

this is a mock social media app for learning

# Backend

## Depedencies to install

- express
- express-validator
- bcryptjs
- config
- gravatar
- jsonwebtoken
- mongoose
- request

## Dev-Dependencies to install (-D)

- nodemon
- concurrently

## Register user in MongoDB

- Create api

  - Create get request to empty endpoint
  - Ensure api is serving to endpoint in postman

- Create config

  - This is a config folder that holds the config files
    - /config
  - default.json holds the connection string to mongodb
  - db.js makes the connection to the database
    - there should be a console log to let you know the connection was successful.

- Create routes

  - This is a seperate folder that holds the api folder.
    - /routes/api
    - users.js, profile.js... etc.
  - Create a simple get req/res to ensure they are connecting in postman
  - Add these routes to the server.js file

- Creat model

  - This is a model folder that will hold all models
    - These files start with a capital (User.js) for best practice

- Add validation

  - You should recieve error messages when data is incorrect
  - You should also get a bad request status when the data is invalid

- Create Business Process
  - Whatever this may be
  - in this case, register user
