require('./db/mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

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
  console.log('id', id);
  if (!ObjectId.isValid(id)) {
    console.log('masuk');
    return res.send(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.send(404).send();
    }
    return res.send(todo);
  })
    .catch((_e) => {
      res.status(404).send();
    });
});

app.listen(port, () => {
  console.log(`Starting at port : ${port}`); // eslint-disable-line no-console
});

module.exports = {
  app,
};
