// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// let _db;

// exports.mongoConnect = callback => {
//   MongoClient.connect(
//     'mongodb+srv://lakshya:312004lakshya@cluster0.i4nia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
//   )
//     .then(client => {
//       console.log('Connected!');
//       _db = client.db('NodeJS');
//       callback();
//     })
//     .catch(err => {
//       console.log(err);
//       throw err;
//     });
// };

// exports.getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw 'No database found!';
// };