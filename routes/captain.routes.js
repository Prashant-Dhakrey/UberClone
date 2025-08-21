const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require("../controllers/captain.controller");


router.post("/register", [
    body('email').isEmail().withMessage('invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('first name must be at least 3 character'),
    body('password').isLength({ min: 6 }).withMessage('password must be 6 character long'),
    body('vehicle.color').isLength({min: 3}).withMessage('color must be at least 3 character '),
    body('vehicle.plate').isLength({min : 3}).withMessage('Plate must be at least 3 character '),
    body('vehicle.capacity').isInt({min : 1}).withMessage('capacity must be at least 1 '),
    body('vehicle.vehicleType').isIn(['car','auto','motorcycle']).withMessage('invalid vehicle type')
], captainController.registerCaptain)

router.post("/login",[
    body('email').isEmail().withMessage('Invalid Email and Password'),
   body('password').isLength({min: 6}).withMessage('Invalid Password')

], captainController.LoginCaptain);

module.exports = router;

