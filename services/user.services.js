const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model')
const Joi = require('joi');

// for genetaring JWT token
const fnGenerateToken = (user) => {
    try {
        var token = jwt.sign(user, 'secretKey', { expiresIn: 24 * 60 * 60 });
        return token;
    } catch (err) {
        console.log('error: ', err)
        return err;
    }
}

// for verifying generated token
const fnVerifyToken = (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
        }
        else if (req.query.token) {
            var token = req.query.token;
        }
        if (token) {
            try {
                var decoded = jwt.verify(token, 'secretKey');
                var _userId = decoded._id || false;
                // checks if the token belongs to same user _id 
                if (_userId === req.params._userId) {
                    var user = userModel.findOne({ _id: new ObjectId(_userId) })
                    if (user) {
                        next();
                    } else {
                        res.status(401).json({
                            message: 'unauthorized user'
                        })
                    }
                } else {
                    res.status(401).json({
                        message: 'invalid user token'
                    })
                }
            } catch (err) {
                res.status(401).json({
                    error: err // when token expires
                })
            }
        } else {
            res.status(404).json({
                error: 'no token provided'
            })
        }
    } catch (err) {
        console.log('error: ', err);
        return next(err);
    }
}

// schema validation
const userSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailId: Joi.string().email().required(),
    password: Joi.string().required().min(8)
});

const fnValidate = (schema = null) => {
    return ((req, res, next) => {
        switch (schema) {
            case 'user':
                var Schema = userSchema;
                break;
        }
        if (!Schema) {
            next(new Error('Schema flag is not defined in validation'));
        } else {
            var data = req.body;
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
            Joi.validate(data, Schema, (err) => {
                if (!err) {
                    next();
                } else {
                    res.status(400).json({
                        message: 'invalid_data',
                        error: err
                    });
                }
            });
        }
    })
}

module.exports = {
    fnGenerateToken,
    fnVerifyToken,
    fnValidate
}