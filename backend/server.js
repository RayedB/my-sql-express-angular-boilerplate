// Express & al
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

//Database
import Sequelize from 'sequelize';

//PassportJS
import passport from 'passport';
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;


const app = express();
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());

import CONFIG from './config/config';

//use passport
app.use(passport.initialize());

//Log Env
console.log("Environment:", CONFIG.app)

//Load models and connect to database
const models = require("./models");
models.sequelize.authenticate().then(() => {
    console.log('Connected to SQL database:', CONFIG.db_name);
})
.catch(err => {
    console.error('Unable to connect to SQL database:',CONFIG.db_name);
});
if(CONFIG.app==='dev'){
    models.sequelize.sync();
    // models.sequelize.sync({ force: true });
}

//Routes
import routes from './routes/routes.js';
app.use('/v1', routes);
app.use('/', function(req, res){
	res.status(200).json({status:"success", message:"Parcel Pending API", data:{}})
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



//This is here to handle all the uncaught promise rejections
const pe = require('parse-error');
process.on('unhandledRejection', error => {
    console.error('Uncaught Error', pe(error));
});
app.listen(8080, () => console.log("Running on 8080"))
module.exports = app;
