const express = require('express');
const mongoose = require('mongoose');

const server = express();
const bodyParser = require('body-parser');
server.use(bodyParser.json());

const session = require('express-session');
const MongoStore = require('connect-mongo');
var dbURL = process.env.MONGO_URL || 'mongodb+srv://minkijeon:cse316assignment4@cluster0.awbia.mongodb.net/test';
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const sessionSecret = 'make a secret string';

// Create Mongo DB Session Store
const store = MongoStore.create({
    mongoUrl: dbURL,
    secret: sessionSecret,
    touchAfter: 24 * 60 * 60
})

// Changing this setting to avoid a Mongoose deprecation warning:
// See: https://mongoosejs.com/docs/deprecations.html#findandmodify
mongoose.set('useFindAndModify', false);

// Setup to use the express-session package
const sessionConfig = {
    store,
    name: 'session',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: true
    }
}

server.use(session(sessionConfig));

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

server.use((req, res, next) => {
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    next();
});


const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send("Need to login");
    }
    next();
}

/*
 *
 */














/*
 *
 */

server.use((err, req, res, next) => {
    console.log("Error handling called");
    res.statusMessage = err.message;

    if (err.name === 'ValidationError') {
        res.status(400).end();
    }
    else {
        res.status(500).end();
    }
})

port = process.env.PORT || 5000;
server.listen(port, () => { console.log('server started!')});