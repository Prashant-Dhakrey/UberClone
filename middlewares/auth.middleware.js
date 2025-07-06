const userModel = require("../models/user.model");
const blackListTokenModel = require("../models/blackListToken");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // Check if token is blacklisted
    const isBlackListed = await blackListTokenModel.findOne({ token });

    if (isBlackListed) {
        return res.status(401).json({ message: "Unauthorized: Token blacklisted" });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded",decoded);

        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Unauthorized: Token invalid or expired" });
    }
};
