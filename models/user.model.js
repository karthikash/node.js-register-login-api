const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String
    },
    password: {
        type: String
    }
})

// Saves the admin's password hashed
userSchema.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (this.isModified('password') || this.isNew) {
        // generate a salt
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);
            // hash the password using our new salt
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// Create method to compare password stored in database
userSchema.methods.comparePassword = function (pw) {
    var user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(pw, user.password, (err, isMatch) => {
            if (err) reject(err);
            resolve(isMatch);
        });
    })
};

module.exports = mongoose.model('users', userSchema);