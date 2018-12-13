const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../model/Todo');

const todos = [{
  _id: new ObjectId(),
  text: 'first test todos',
},
{
  _id: new ObjectId(),
  text: 'second test todos',
  completed: true,
  completedAt: 333,
}];

beforeEach((done) => {
  Todo.deleteMany({}).then(() => Todo.insertMany(todos))
    .then(() => done());
});

describe('POST /todos', () => {
  it('should create new todo', (done) => {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        Todo.find({ text }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(e => done(e));
      });
  });

  it('should not create with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch(e => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get todos by id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    const hexid = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${hexid}`)
      .expect(404)
      .end(done);
  });
  it('should return 404 if non object ids', (done) => {
    const hexid = new ObjectId().toHexString();
    request(app)
      .get('/todos/abn123')
      .expect(404)
      .end(done);
  });

  describe('DELETE /todos/:id', () => {
    it('Should remove todo doc', (done) => {
      const hexid = todos[1]._id.toHexString();

      request(app)
        .delete(`/todos/${hexid}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexid);
        })
        .end((err, _res) => {
          if (err) {
            return done(err);
          }
          Todo.findById(hexid).then((todo) => {
            expect(todo).toBeNull();
            done();
          })
            .catch(e => done(e));
        });
    });

    it('Should retur 404 if todo not found', (done) => {
      const hexid = new ObjectId().toHexString();

      request(app)
        .delete(`/todos/${hexid}`)
        .expect(404)
        .end(done);
    });
    it('Should return 404 if is is invalid', (done) => {
      request(app)
        .delete('/todos/128idk')
        .expect(404)
        .end(done);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('Should update te todo', (done) => {
      const hexid = todos[0]._id.toHexString();
      const text = 'this be should be new text';
      request(app)
        .patch(`/todos/${hexid}`)
        .send({ completed: true, text })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(true);
          expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end(done);
    });
    it('Should clean completedAt when completed false', (done) => {
      const hexid = todos[0]._id.toHexString();
      const text = 'this be should be new text';
      request(app)
        .patch(`/todos/${hexid}`)
        .send({ completed: false, text })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toBeNull();
        })
        .end(done);
    });
  });
});
