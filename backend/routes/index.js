const express = require('express');
const router = express.Router();

router.get('/hello/world', function(req, res) {
    // sets a cookie on the server response with the name of XSRF-TOKEN to the value of the req.csrfToken methods's return
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!');
});

module.exports = router;
