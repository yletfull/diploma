/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');

const { PORT = 3000, NODE_ENV, DB_URL } = process.env;
const { app } = require('./app');

const mongooseConnection = () => {
  const servUrl = NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/mestodb';
  mongoose.connect(servUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  mongoose.connection.on('connected', () => {
    console.log(`Succesfully connected to MongoDB Database "${servUrl}: ${PORT}"`);
  });
  mongoose.connection.on('error', (err) => {
    console.error(`Database "${servUrl}" Connection error: ${err}`);
  });
};

mongooseConnection();
app.listen(PORT, () => {});
