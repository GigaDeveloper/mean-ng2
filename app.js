const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const fs = require('fs');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

const app = express();

// log directory
const logDirectory = path.join(__dirname, 'log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// create a rotating write stream
const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

const users = require('./routes/users');

// Port Number
const port = 3040;

app.use(morgan('combined', {stream: accessLogStream}));

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

// Index Route
app.get('/', (req, res)=>{
    res.send("Invalid endpoint!..");
});

// Index Route
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(port, () => {
    console.log("Server started on port: " + port);
});