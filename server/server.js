const express = require('express')
const bodyParser = require('body-parser')

const { mongoose } = require('./db/mongoose')
const { User } = require('./models/todo')
const { Todo } = require('./models/user')

var app = express()

const port = 4000
app.listen(port, () => {
  console.log(`started on port ${port}`)
})
