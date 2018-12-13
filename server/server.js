const env = process.env.NODE_ENV || 'development';
console.log(env);

if (env === 'development') {
  process.env.PORT = 4000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 4000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
require('./db/mongoose');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const _ = require('lodash');

const { Todo } = require('./model/Todo');
// const { User } = require('./model/User');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  todo.save().then((doc) => {
    res.status(200).send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({ todos });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({ todo });
  }).catch((_e) => {
    res.status(404).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.sendStatus(404);
  }
  Todo.findByIdAndDelete(id).then((todo) => {
    if (!todo) {
      return res.sendStatus(404);
    }
    return res.send({ todo });
  })
    .catch(_e => res.send(404).send());
});

app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  const body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectId.isValid(id)) {
    return res.sendStatus(404);
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completeAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completeAt = null;
  }
  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then((todo) => {
      if (!todo) {
        return res.sendStatus(404);
      }
      res.send({ todo });
    }).catch((_e) => {
      res.sendStatus(404);
    });
});

app.listen(port, () => {
  console.log(`Starting at port : ${port}`); // eslint-disable-line no-console
});

module.exports = {
  app,
};
