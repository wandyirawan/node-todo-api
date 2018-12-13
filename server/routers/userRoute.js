const { ObjectId } = require('mongodb');
const _ = require('lodash');

const { User } = require('./../model/User');

const create = (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);
  user.save().then(() => user.generateAuthToken()).then((token) => {
    console.log('token', JSON.stringify(token, undefined, 2));
    res.header('x-auth', token).send(user);
  })
    .catch((e) => {
      res.status(400).send(e);
    });
};

const getAll = (req, res) => {
  User.find().then((users) => {
    res.send({ users });
  }, (e) => {
    res.status(400).send(e);
  });
};

const getById = (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }
  User.findById(id).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    res.send({ user });
  }).catch((_e) => {
    res.status(404).send();
  });
};

const deleteById = (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.sendStatus(404);
  }
  User.findByIdAndDelete(id).then((user) => {
    if (!user) {
      return res.sendStatus(404);
    }
    return res.send({ user });
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
  User.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then((user) => {
      if (!user) {
        return res.sendStatus(404);
      }
      res.send({ user });
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
