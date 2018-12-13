const _ = require('lodash');

const { User } = require('./../models/User');

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

const getByToken = (req, res) => {
  res.send(req.user);
};

module.exports = {
  create,
  getByToken,
};
