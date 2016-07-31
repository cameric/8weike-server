'use strict';

// The exported router class
class Router {
    constructor(_app) {
        this.app = _app;
    }

    setup() {
        this.app.get('/', function (req, res) {
            res.render('index');
        })
    }
}

module.exports = Router;