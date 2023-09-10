const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

const userRoute = require('./routes/userRoutes');
const recordingRoute = require('./routes/recordingRoutes');

const app = express();

const db = process.env.DB_URL;
const { SECRET_KEY } = process.env;
const PORT = process.env.PORT || 9999;

//Middlewares
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// MongoDB database configuration
mongoose
  .connect(db)
  .then(() => {
    console.log('Connected to DB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log('failed to connect mongoDB', error));

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', userRoute);
app.use('/recording', recordingRoute);

module.exports = app;
