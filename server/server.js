require('./config/config.js');
require('./db/mongoose');

const express = require('express');
const bodyParser = require('body-parser');
// const { User } = require('./model/User');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

require('./routers')(app);

app.listen(port, () => {
  console.log(`Starting at port : ${port}`); // eslint-disable-line no-console
});

module.exports = {
  app,
};
