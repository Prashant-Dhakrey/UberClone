const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const   userController = require('../controllers/user.controller');
const authmiddleware = require("../middlewares/auth.middleware");



router.post('/register', [

    body('email').isEmail().withMessage('invalid Email'),
    body('fullname.firstname').isLength({ min: 2 }).withMessage('first name must be at least 3 character'),
    body('password').isLength({ min: 6 }).withMessage('password must be 6 character long')

],
    userController.registerUser 
);

router.post('/login',[  

    body('email').isEmail().withMessage("Invalid Email"),
    body('password').isLength({min:4}).withMessage("Paasword must be 4 charater "),

],  userController.loginUser );

router.get("/profile" ,authmiddleware.authUser, userController.getUserProfile);

router.get("/logout" ,authmiddleware.authUser, userController.logoutUser);


module.exports = router;
