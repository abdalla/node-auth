import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// define the schema for our user model
const userSchema = mongoose.Schema({
    // local: {
    //     email: String,
    //     password: String,
    // },
    // facebook: {
    //     id: String,
    //     token: String,
    //     email: String,
    //     name: String
    // },
    // twitter: {
    //     id: String,
    //     token: String,
    //     displayName: String,
    //     username: String
    // },
    // google: {
    //     id: String,
    //     token: String,
    //     email: String,
    //     name: String
    // }

///
//  userName: { 
//         type: String, 
//         //match: /[a-zA-Z]/, 
//         required: true 
//     },
///

    name: { 
        type: String, 
        required: true 
    },
    userName: { 
        type: String,
        required: true 
    },
    password: String,
    email: String,
    admin: Boolean
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

//middleware
userSchema.pre('save', function (next) {
  this.password = this.generateHash(this.password);
  next();
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);



