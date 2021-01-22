const jwt = require('jsonwebtoken');
const config = require('../config/keys');

const auth =  (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ errorMessage: 'No token, authorization denied.'});
    }

    try {
        const decoded = jwt.verify(token, config.secret);        
        req.user = decoded;
        next();
    }
    catch(error) {
        res.status(400).json({ errorMessage: 'Token is not valid'});
    }
};

const includeUser = (req, res, next) => {
    const token = req.header('auth-token');    
    if (token) {
        try {
            const decoded = jwt.verify(token, config.secret);
            req.user = decoded;            
        }
        catch (err){            
        }
    }
    next(); 
};

exports.auth = auth;
exports.includeUser = includeUser;