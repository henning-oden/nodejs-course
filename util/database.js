const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://henning-user:Dr4G0n@cluster0.o3hei.mongodb.net/<dbname>?retryWrites=true&w=majority'
  )
    .then(client => {
      console.log('Connected!');
      callback(client);
  })
    .catch(err => console.log(err));
}

module.exports = mongoConnect;