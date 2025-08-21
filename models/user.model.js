
require('dotenv').config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

   
const userSchema = new mongoose.Schema({

    fullname: {
          
        firstname: {
            type: String,
            required: true,
            minlength: [2, 'First name must be at least be at 2 characters long'],

        },
        lastname: {
            type: String,
            minlength: [2, 'Last name must be at least be at 2 characters long'],
        },

    },

    email: {

        type: String,
        required: true,
        unique: true,
        minlength: [2, 'First name must be at least be at 2 characters long'],

    },
    password: {
        type: String,
        required: true,
        select: false

    },

    // this is use for live tracking of user 

    socketId: {

        type: String,

    }
});

// 🔐 Hash password before save

// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();

//     try {
//         this.password = await bcrypt.hash(this.password, 10);
//         next();
//     } catch (err) {
//         next(err);
//     }
// });


//  JWT
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.jwt_SECRET);
    return token;
};


//  Compare password  

//  this is store password  in  database password coverting in hash password 

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// userSchema.methods.comparePassword = async function (password) {
//     return password === this.password;
// };

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
