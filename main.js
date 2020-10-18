var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var helmet = require('helmet');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var port = 3000;

app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('files'));
app.use(
    session({
        secret: 'sdfa1212sdfe!@#2',
        resave: false,
        saveUninitialized: true,
        store: new FileStore(),
    })
);

app.get('*', function (request, response, next) {
    fs.readdir('./data', function (error, filelist) {
        request.list = filelist;
        next();
    });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use(function (err, request, response, next) {
    console.error(err.stack);
    response.status(500).send('Something broke!');
});

app.use(function (request, response, next) {
    response.status(404).send(`Sorry can't find that!`);
});

app.listen(port, function () {
    console.log(`Example app listening at http://localhost:${port}`);
});
