const mongoose = require('mongoose');

const { MONGO_URL, DATABASE_NAME } = process.env;
const connectWithRetry = () => {
  mongoose
    .connect(`${MONGO_URL}/${DATABASE_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((error) => console.error('[Mongoose Connection Issue] [ERROR]', error));
};

mongoose.connection.on('connected', () => {
  console.log('info', 'Mongoose connection:', 'Connection Established');
});

mongoose.connection.on('reconnected', () => console.log('info', 'Mongoose connection:', 'Connection Reestablished'));

mongoose.connection.on('disconnected', () => {
  console.log('info', 'Mongoose connection:', 'Connection Disconnected');
  setTimeout(connectWithRetry, 5000);
});

mongoose.connection.on('close', () => console.log('info', 'Mongoose connection Issue:', 'Connection Closed'));

mongoose.connection.on('error', (error) => console.log('error', 'Mongoose connection Issue:', error));

module.exports = { connectDB: connectWithRetry, mongoose };
