const captainModel = require("../models/captain.model");
const blackList = require("../models/blackListToken");
const captianService = require("../services/captain.service");
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const captainExits = await captainModel.findOne({ email });

    if (captainExits) {
        return res.status(400).json({message: 'Captain already exist '});
    }
    
    const hashedPassword = await captainModel.hashPassword(password);
   
const captain = await captianService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType
});
    
    const token  = captain.generateAuthToken();
    res.status(201).json({ token , captain });
};

module.exports.LoginCaptain = async (req,res,next) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({error: errors.array()});
    }

    const {email, password} = req.body;

    const captain = await  captainModel.findOne({email}).select('+password');

    if(!captain){
        return res.status(401).json({msg: "Invalid Email and Password"})
    }

    const isMatch = await captain.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({msg: 'Invalid email or Password '});
    }

    const token = generateAuthToken()
    res.cookie('token',token);
    
    res.status(200).json({token, captain});

};
