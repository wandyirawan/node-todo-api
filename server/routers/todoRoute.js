const { ObjectId } = require('mongodb');
const _ = require('lodash');

const { Todo } = require('./../models/Todo');

const create = (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  todo.save().then((doc) => {
    res.status(200).send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
};

const getAll = (req, res) => {
  Todo.find().then((todos) => {
    res.send({ todos });
  }, (e) => {
    res.status(400).send(e);
  });
};

const getById = (req, res) => {
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
};

const deleteById = (req, res) => {
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
};

const updateById = (req, res) => {
  const { id } = req.params;
  const body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectId.isValid(id)) {
    return res.sendStatus(404);
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
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
};

module.exports = {
  create,
  getAll,
  getById,
  deleteById,
  updateById,
};
