const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/user');
const Daylog = require('./models/daylog');
const Question = require('./models/question');

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
        // secure: true
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
    if (req.session.userId == null) {
        return res.status(401).send("Need to login");
    }
    next();
}

////////////////////////////////////////////////////////////////////////////////

/*
 * User
 */

//register
server.post('/api/users', wrapAsync(async function (req, res) {
    const { name, email, password, address1, address2, profile_url } = req.body;
    const user = new User({ name, email, password, address1, address2, profile_url })
    await user.save();
    req.session.userId = user._id;
    res.sendStatus(204);
}));


//login
server.post('/api/login', wrapAsync(async function (req, res) {
    const { email, password } = req.body;
    const user = await User.findAndValidate(email, password);
    if (user) {
        req.session.userId = user._id;
        res.sendStatus(204);
    }
    else {
        res.sendStatus(401);
    }
}));

//logout
server.post('/api/logout', requireLogin, wrapAsync(async function (req, res) {
    console.log(req.session.userId)
    req.session.userId = null;
    res.sendStatus(204);
}));

//get users (admin)
server.get('/api/users', wrapAsync(async function (req, res) {
    const users = await User.find({});
    res.json(users);
}));

//get current user (admin)
server.get('/api/currentuser', wrapAsync(async function (req, res) {
    if (req.session.userId === undefined) {
        res.json({});
    }
    else {
        const currentUser = await User.findById(req.session.userId);
        res.json(currentUser);
    }
}));

//update user
server.put('/api/users/:id', requireLogin, wrapAsync(async function (req, res) {
    const id = req.params.id;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    await User.findByIdAndUpdate(id, {
            'name': req.body.name,
            "email": req.body.email,
            'password': req.body.password,
            'address1': req.body.address1,
            'address2': req.body.address2,
            'profile_url': req.body.profile_url,
        },
        {runValidators: true});
    res.sendStatus(204);
}));

//delete user
server.delete('/api/users/:id', requireLogin, wrapAsync(async function (req, res) {
    const id = req.params.id;
    const result = await User.findByIdAndDelete(id);
    console.log("Deleted successfully: " + result);
    res.json(result);
}));

////////////////////////////////////////////////////////////////////////////////

/*
 * Daylog
 */

//get daylogs
server.get('/api/daylogs', requireLogin, wrapAsync(async function (req, res) {
    const daylogs = await Daylog.find({creator: req.session.userId});
    res.json(daylogs);
}));

//get daylog by id
server.get('/api/daylogs/:id', requireLogin, wrapAsync(async function (req, res) {
    let id = req.params.id;
    if (mongoose.isValidObjectId(id)) {
        const daylog = await Daylog.findById(id);
        if (daylog) {
            res.json(daylog);
            return;
        } else {
            throw new Error('Daylog Not Found');
        }
    } else {
        throw new Error('Invalid Daylog Id');
    }
}));

//get daylogs by date

//add daylog
server.post('/api/daylogs', requireLogin, wrapAsync(async function (req, res) {
    console.log("Posted with body: " + JSON.stringify(req.body));
    const newDaylog = new Daylog({
        date: req.body.date,
        creator: req.session.userId
    })
    await newDaylog.save();
    res.json(newDaylog);
}));

//update daylog
server.put('/api/daylogs/:id', requireLogin, wrapAsync(async function (req, res) {
    const id = req.params.id;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    await Daylog.findByIdAndUpdate(id,
        {
            "date": req.body.date,
            "creator": req.session.userId
        },
        {runValidators: true});
    res.sendStatus(204);
}));

//delete daylog
server.delete('/api/daylogs/:id', requireLogin, wrapAsync(async function (req, res) {
    const id = req.params.id;
    const result = await Daylog.findByIdAndDelete(id);
    console.log("Deleted successfully: " + result);
    res.json(result);
}));





////////////////////////////////////////////////////////////////////////////////

/*
 * Question
 */

//get questions @
server.get('/api/questions', requireLogin, wrapAsync(async function (req, res) {
    const questions = await Question.find({creator: req.session.userId}); // @
    res.json(questions);
}));

//get question by id
server.get('/api/questions/:id', requireLogin, wrapAsync(async function (req, res) {
    let id = req.params.id;
    if (mongoose.isValidObjectId(id)) {
        const question = await Question.findById(id);
        if (question) {
            res.json(question);
            return;
        } else {
            throw new Error('Question Not Found');
        }
    } else {
        throw new Error('Invalid Question Id');
    }
}));

//get questions by type @

server.get('/api/questions/findByDaylog/:id', requireLogin, wrapAsync(async function (req, res) {
    let id = req.params.id;
    const questions = await Question.find({daylog: id}); // @
    res.json(questions);
}));

//get questions by date @

//add question
server.post('/api/questions', requireLogin, wrapAsync(async function (req, res) {
    console.log("Posted with body: " + JSON.stringify(req.body));
    const newQuestion = new Question({
        type: req.body.type,
        header: req.body.header,
        answer: req.body.answer,
        daylog: req.body.daylog
    })
    await newQuestion.save();
    res.json(newQuestion);
}));

//update question @
server.put('/api/questions/:id', requireLogin, wrapAsync(async function (req, res) {
    const id = req.params.id;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    await Question.findByIdAndUpdate(id,
        {
            "type": req.body.type,
            "header": req.body.header,
            "answer": req.body.answer,
            "daylog": req.body.daylog
        },
        {runValidators: true});
    res.sendStatus(204);
}));

//delete question
server.delete('/api/questions/:id', requireLogin, wrapAsync(async function (req, res) {
    const id = req.params.id;
    const result = await Question.findByIdAndDelete(id);
    console.log("Deleted successfully: " + result);
    res.json(result);
}));

////////////////////////////////////////////////////////////////////////////////

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