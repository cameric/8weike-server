'use strict';

/* The entry point for the nSERVER */
const express = require('express');

// Constants
const PORT = 8080;

// App
const app = express();
app.get('/', function (req, res) {
    res.send('8weike\n');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
