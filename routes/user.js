const express = require('express');
const router = express.Router();
const authRoute = require('../controllers/user.controller');
const validate = require('../services/user.services')

router.post('/register', validate.fnValidate('user'), authRoute.fnUserRegister);
router.post('/login', authRoute.fnUserLogin);
router.get('/profile/:_userId', validate.fnVerifyToken, authRoute.fnUserProfile);

module.exports = router;