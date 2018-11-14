var mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(
  'mongodb://localhost:27017/TodoApp',
  { useNewUrlParser: true }
)

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    require: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
})

var newTodo = new Todo({
  text: 'edit this video'
  //   completed: true,
  //   completedAt: 123
})

newTodo.save().then(
  doc => {
    console.log(`save Todo ${JSON.stringify(doc, undefined, 2)}`)
  },
  e => {
    console.log('unable to save Todo', e)
  }
)
