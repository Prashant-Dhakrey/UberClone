const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const userModel = require("../models/user.model");
const blackListTokenModel = require("../models/blackListToken");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { fullname, email, password } = req.body;

  try {
    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password
    });

    // Token generation (if defined in model)
    const token = user.generateAuthToken ? user.generateAuthToken() : null;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.loginUser = async(req,res,next) => {

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user and include password
    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: "Invalid Email And Password" });
    }

    // Compare entered password with hashed one
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    // Generate token
    const token = user.generateAuthToken();

    // ✅ Set token in cookie correctly
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Strict',
      secure: false,
    });

    // ✅ Send success response
    res.status(200).json({ message: "Login successful", user });
    
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

   
};

module.exports.getUserProfile = async(req,res,next)=>{

  res.status(200).json(req.user);

};

module.exports.logoutUser = async(req,res,next)=>{

  res.clearcookie('token');

  const token = req.cookie.token || req.headers.authoriztion.split('')[ 1 ];
  
  await blackListModel.create({ token });

  
  res.status(200).json({Message: "Logged out"});

}