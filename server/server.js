const express = require('express')
const bodyParser = require('body-parser')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

var app = express()

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then(
    doc => {
      res.send(doc)
    },
    err => {
      res.status(400).send(err)
    }
  )
})

app.get('/todos', (req, res) => {
  Todo.find().then(
    todos => {
      res.send({ todos })
    },

    err => {
      res.status(400).send(err)
    }
  )
})

const port = 4000
app.listen(port, () => {
  console.log(`started on port ${port}`)
})

module.exports = { app }
