var path                        = require('path');
var express                     = require('express');
var app                         = express();
var helmet                      = require('helmet');
var passport                    = require('passport');
var mongoose                    = require('mongoose');
var bodyParser                  = require('body-parser');
var index                       = require('./routes/index');
var usersRouter                 = require('./routes/user');

//set environment variable
require('dotenv').config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));


//use middleware
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());
app.set('view engine', 'jade');
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


//Routes
app.use('/', index);
app.use('/user', usersRouter);


const PORT = process.env.PORT || 3000;

//connectig to mongoDB
mongoose.Promise = global.Promise;
(function connect() {
    mongoose.connect(process.env.mongodbString, { useNewUrlParser: true })
    .then (
      () => { console.log("Connected to Mongodb Successfull"); },
      err => { return err ;}
    );
})();
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

 app.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT);
});


module.exports = app;
