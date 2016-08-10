"use strict";

// This file configures some middlewares for authentication

const requiresLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = {
    requiresLogin
};