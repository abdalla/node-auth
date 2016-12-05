import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// define the schema for our user model
const userSchema = mongoose.Schema({
    name: { 
        type: String, 
        required:  [true, 'Name is required.'] 
    },
    userName: { 
        type: String,
        required: true,
        index: { 
            unique: true 
        } 
    },
    password: { 
        type: String,
        required: true 
    },
    email: { 
        type: String,
        required: true,
        index: { 
            unique: true 
        } 
    },
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

// userSchema.pre('findOneAndUpdate', function (next) {
//     console.log('update is not working');
//     this.update({}, { $inc: { __v: 1 } }, next );
// });

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);



