const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to Connect to Mongodb server');
  }
  console.log('Connect to Mongodb server');
  const db = client.db('TodoApp');

  db.collection('Todos').find({
    _id: ObjectId('5c10ff0ae6ca8a36bc1ff1a0'),
  }).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (_err) => {
    console.log('Unable to fetch Todos', _err);
  });
  client.close();
  return false;
});
