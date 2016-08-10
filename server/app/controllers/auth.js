// This is the controller for app endpoints about user accounts

class AuthController {
    constructor() {}

    static generalLogin(req, res) {
        if (!req.user) {
            res.redirect('/login');
        } else {
            res.redirect('/users/' + req.user.id);
        }
    }

    static weixinLogin(req, res) {

    }

    static weiboLogin(req, res) {

    }

    static signup(req, res) {

    }

    static logout(req, res) {

    }
}

module.exports = AuthController;
