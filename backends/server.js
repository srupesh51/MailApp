const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.SERVER_PORT;
app.use(cors());
app.use(bodyParser.json());
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 30, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 100,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  dbName: process.env.MONGO_DB_DATABASE
};
mongoose.set('debug', true);
mongoose.connect('mongodb://' + process.env.MONGO_DB_USERNAME + ':' + process.env.MONGO_DB_PASSWORD + '@' + process.env.MONGO_DB_HOST + ':' + '27017' + '/' + process.env.MONGO_DB_DATABASE, options)
  .then(() => {
      console.log('Connected to Database!');
}).catch((error) => {
      console.log(error);
      console.log('Connection Failed!!!');
});
const mailRoutes = require('./routes/mail');
app.use('/api/mails', mailRoutes);
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
http.listen(PORT, () => {
    console.log("Server is running on Port: " + PORT);
});
// let users = [];
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('my message', (msg) => {
    console.log('message: ' + msg);
  });
  socket.on('MAIL_SENT', (msg) => {
    io.emit('MAIL_RECV', msg);
  });
  socket.on('MSG_SENT', (msgObject) => {
    io.emit('MSG_RECV', msgObject);
  });
});
module.exports = app;
