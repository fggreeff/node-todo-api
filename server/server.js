const { config } = require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

const { authenticate } = require('./middleware/authenticate')

var app = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
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

app.get('/todos', authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id }).then(
    todos => {
      res.send({ todos })
    },

    err => {
      res.status(400).send(err)
    }
  )
})

app.get('/todos/:id', (req, res) => {
  var id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }
      res.send({ todo })
    })
    .catch(e => {
      res.status(400).send()
    })
})

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }
      res.send({ todo })
    })
    .catch(e => {
      res.status(400).send()
    })
})

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id
  //Use lodash to cherry pick subset properties from the body we want to allow updates on
  var body = _.pick(req.body, ['text', 'completed'])

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null //this removes value from DB
  }
  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }
      res.send({ todo })
    })
    .catch(e => {
      res.status(400).send()
    })
})

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])

  var user = new User(body)

  user
    .save()
    .then(() => {
      return user.generateAuthToken()
    })
    .then(token => {
      res.header('x-auth', token).send(user) // x- custom header
    })
    .catch(e => {
      res.status(400).send(e)
    })
})

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header('x-auth', token).send(user)
      })
    })
    .catch(e => {
      res.status(400).send()
    })
})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send()
    },
    () => {
      res.status(400).send()
    }
  )
})

app.listen(port, () => {
  console.log(`started on port ${port}`)
})

module.exports = { app }
