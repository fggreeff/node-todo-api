var mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(
  'mongodb://localhost:27017/TodoApp',
  { useNewUrlParser: true }
)

var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
})

var newTodo = new Todo({
  text: 'Feed cat dinner',
  completed: true,
  completedAt: 123
})

newTodo.save().then(
  doc => {
    console.log(`save Todo ${JSON.stringify(doc, undefined, 2)}`)
  },
  e => {
    console.log('unable to save Todo', e)
  }
)
