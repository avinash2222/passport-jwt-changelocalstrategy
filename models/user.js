require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
var passportLocalMongoose = require('passport-local-mongoose');

var address = new Schema({
    email : {
        type : String,
        trim: true
    },
    secondary_phone_number : {
        type : Number,
        trim: true
    },
    state : {
        type : String
    },
    city : {
        type : String
    },
    pincode : {
        type : Number,
        trim: true
    },
    locality : {
        type : String
    },
    landmark : {
        type : String
    },
    full_address : {
        type : String
    }
});


var newSchema = new Schema({
    phone_number : {
        type : Number,
        // required:"enter phone no",
        trim : true
        // unique : true
    },
    // username automatically added by passport-local-mongoose plugin
    // username : {
    //     type : String,
    //     trim : true
    // },
    first_name : {
        type : String,
        // required : "enter first name",
        trim: true
    },
    facebookId : String,
    last_name : {
        type : String,
        // required : "enter last name",
        trim: true   
    }, 
    organisation : {
        type : String
    },
    sub_organisation : {
        type : String
    },
    notes : {
        type : String,
        trim : true
    },
    active : {
        type : Boolean,
    },
    address : address,
    password : {
        type : String,
        trim : true,
        required : "enter password"
    },
    image : { 
        type : String,
        //required:true
    },
    role: {
        type: String,
        enum : ['user', 'operator', 'admin'],
        default: 'user',
        required: 'Specify user type',
    },
  },{
  timestamps : true
  },{
    versionKey: false
});


newSchema.pre('save', async function (next) {
    try {
      const user = this;
      if (!user.isModified('password')) next();
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(this.password, salt);
      this.password = passwordHash;
      next();
    } catch (error) {
      next(error);
    }
  });


newSchema.methods.isValidPassword = async function (newPassword) {
    try {
      return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
      throw new Error(error);
    }
  };

//phone_number set to unique by passportLocalMongoose
newSchema.plugin(passportLocalMongoose, { usernameField : 'phone_number' }); 

module.exports = mongoose.model("User",newSchema);