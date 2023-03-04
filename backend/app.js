// import the following packages
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

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
        policy: "cross-origin"
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
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

// connect all routers
app.use(routes);

// export Express application
module.exports = app;
