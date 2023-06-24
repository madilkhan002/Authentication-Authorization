const mongoose = require('mongoose');
// Connect to MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/testdb';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

  module.exports = mongoose;