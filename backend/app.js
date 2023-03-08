// import the following packages
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');

// import routers
const routes = require('./routes');

// isProduction is true if the environment is in production (checks the backend/config/index.js file)
const { environment } = require('./config');
const isProduction = environment === 'production';

// initialize the Express application
const app = express();

// connect the morgan middleware for logging information about requests/responses
app.use(morgan('dev'));

// connect the cookie-parser middleware for parsing cookies
app.use(cookieParser());

// connect the express.json middleware for parsing JSON bodies of requests with Content-Type="application/json"
app.use(express.json());

// connect security middlewares
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: 'cross-origin'
    })
);

// set the _csrf token and create req.csrfToken method (protect against CSRF attacks)
// add a _csrf cookie that is HTTP-only (can't be read by JS) to any server response
// add a req.csrfToken method on all requests, whose value will be set to another cookies XSRF-TOKEN
// XSRF-TOKEN cookie values needs to be sent in the header of any request (except GET)
// header will be used to validate the _csrf cookie to confirm the request comes from an authorized site
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && 'Lax',
            httpOnly: true
        }
    })
);

// connect all routers
app.use(routes);

// resource-not-found error handler: catches unhandled requests and forwards to error handler
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = 'Resource Not Found';
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});

// sequelize error handler: processes sequelize errors
app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = 'Validation error';
        err.errors = errors;
    }
    next(err);
});

// error-formatter error handler: formats all errors before returning JSON response
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

// export Express application
module.exports = app;
