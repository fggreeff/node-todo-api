# node-todo-api

Restful node express service using mongo to manage a todo list

## Getting started

Clone repository

Install packages

```sh
npm i
```

Start the application

```
npm start
```

Run the tests

```sh
npm run test-watch
```

### Postman collection

All endpoints are listed in the following collection:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/1ea3bdec6eb55f2e9f7a)

# Deployment

Access a deployed version
[Heroku](https://shrouded-peak-66177.herokuapp.com/todos)

Alternatively, deploy the application to your own Heroku account
Deploy `git push heroku master`
Create `heroku create`
Add mongoDB addon `heroku addons:create mongolab:sandbox`
View env vars `heroku config`
Debug `heroku logs`
Open URL `heroku open`

## Source

[Resource](https://www.udemy.com/the-complete-nodejs-developer-course-2)
