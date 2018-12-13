const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const { Todo } = require('./../../models/Todo');
const { User } = require('./../../models/User');

const userOneId = new ObjectId();

const userTwoId = new ObjectId();

const users = [{
  _id: userOneId,
  email: 'urwah@example.com',
  password: 'userPassOne',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString(),
  }],
}, {
  _id: userTwoId,
  email: 'james@example.com',
  password: 'userPassTwo',
}];


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

const populateTodo = (done) => {
  Todo.deleteMany({}).then(() => Todo.insertMany(todos))
    .then(() => done());
};
const populateUser = (done) => {
  User.deleteMany({}).then(() => {
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {
  todos, populateTodo, users, populateUser,
};
