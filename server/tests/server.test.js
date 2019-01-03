const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('../server')
const { Todo } = require('../models/todo')
const { todos, populateTodos, users, populateUsers } = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

/*beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});*/

describe('POST /todos', () => {
  it('should create a new todo', done => {
    var text = 'Test todo text'

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1)
            expect(todos[0].text).toBe(text)
            done()
          })
          .catch(e => done(e))
      })
  })

  it('should not create todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2)
            done()
          })
          .catch(e => done(e))
      })
  })
})

describe('GET /todos', function() {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })
  it('should return a 404 if todo is not found', done => {
    var hexid = new ObjectID().toHexString()

    request(app)
      .get(`/todos/${hexid}`)
      .expect(404)
      .end(done)
  })

  it('should return a 404 for non-object ids', done => {
    request(app)
      .get(`/todos/123ttt`)
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('should remove a todo', done => {
    var hexid = todos[1]._id.toHexString()
    request(app)
      .delete(`/todos/${hexid}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexid)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.findById(hexid)
          .then(todo => {
            expect(todo).not.toBeTruthy()
            done()
          })
          .catch(e => done(e))
      })
  })
  it('should return a 404 if todo not found', done => {
    var hexid = new ObjectID().toHexString()

    request(app)
      .delete(`/todos/${hexid}`)
      .expect(404)
      .end(done)
  })
  it('should return 404 if object id is invalid', done => {
    request(app)
      .delete(`/todos/123ttt`)
      .expect(404)
      .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('should update the todo', done => {
    var hexid = todos[0]._id.toHexString()

    var todoUpdate = {
      text: 'Eat banana pancakes',
      completed: true
    }

    request(app)
      .patch(`/todos/${hexid}`)
      .send(todoUpdate)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todoUpdate.text)
        expect(res.body.todo.completed).toBe(todoUpdate.completed)
        expect(typeof res.body.todo.completedAt).toBe('number')
      })
      .end(done)
  })

  it('should clear completedAt when todo is not completed', done => {
    var hexid = todos[1]._id.toHexString()

    var todoUpdate = {
      text: 'Make banana pancakes',
      completed: false
    }

    request(app)
      .patch(`/todos/${hexid}`)
      .send(todoUpdate)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todoUpdate.text)
        expect(res.body.todo.completed).toBe(todoUpdate.completed)
        expect(res.body.todo.completedAt).not.toBeTruthy()
      })
      .end(done)
  })
})
