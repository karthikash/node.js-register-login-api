const userModel = require('../models/user.model');
const jwt = require('../services/user.services')
const _ = require('lodash');

const fnUserRegister = async (req, res, next) => {
    try {
        var body = _.pick(req.body, ['firstName', 'lastName', 'emailId', 'password']);
        var user = await userModel.findOne({
            emailId: body.emailId
        });
        if (user) {
            return res.status(419).json({
                message: 'email already registered'
            });
        } else {
            var result = new userModel(body).save();
            return res.status(200).json({
                message: 'new user registered',
            });
        }
    } catch (err) {
        console.log('error: ', err);
        return next(err);
    }
}

const fnUserLogin = async (req, res, next) => {
    try {
        var body = _.pick(req.body, ['emailId', 'password']);
        var user = await userModel.findOne({
            emailId: body.emailId
        });
        var payload = _.pick(user, ['_id']);
        if (!user) {
            res.status(404).json({
                error: 'user not found'
            })
        } else {
            var match = await user.comparePassword(body.password);
            if (!match) {
                res.status(401).json({
                    message: 'unauthenticated user'
                });
            } else {
                var token = await jwt.fnGenerateToken(payload);
                var result = _.pick(user, ['emailId', 'password']);
                return res.header({
                    'Authorization': token
                }).status(200).json({
                    message: 'user login success',
                    token: token,
                })
            }
        }
    } catch (err) {
        console.log('error: ', err);
        return next(err);
    }
}

const fnUserProfile = async (req, res, next) => {
    try {
        var _userId = req.params._userId;
        var user = await userModel.findById({ _id: new ObjectId(_userId) }, null, { firstName: 1, lastName: 1 })
        if (user) {
            res.status(200).json({
                message: 'Welcome to your profile'
            })
        } else {
            res.status(400).json({
                error: 'user not found'
            })
        }
    } catch (err) {
        console.log('error: ', err);
        return next(err);
    }
}

module.exports = {
    fnUserRegister,
    fnUserLogin,
    fnUserProfile
}