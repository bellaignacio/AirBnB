const express = require('express');
const router = express.Router();

const apiRouter = require('./api');
router.use('/api', apiRouter);

// router.get('/hello/world', function(req, res) {
//     // sets a cookie on the server response with the name of XSRF-TOKEN to the value of the req.csrfToken methods's return
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     res.send('Hello World!');
// });

router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
});

module.exports = router;
