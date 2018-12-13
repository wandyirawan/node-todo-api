const todoRoute = require('./todoRoute');
const userRoute = require('./userRoute');
const { authenticate } = require('./../middleware/authenticate');

module.exports = (app) => {
  // Route Todos
  app.post('/todos', todoRoute.create);
  app.get('/todos', todoRoute.getAll);
  app.get('/todos/:id', todoRoute.getById);
  app.delete('/todos/:id', todoRoute.deleteById);
  app.patch('/todos/:id', todoRoute.updateById);

  // Route Users
  app.post('/users', userRoute.create);
  app.get('/users/me', authenticate, userRoute.getByToken);
};
