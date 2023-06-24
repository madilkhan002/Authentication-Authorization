const validator = require('validator');
const mongoose = require('../db/connection'); 
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        validate(val){
            if(!validator.isEmail(val))
            {
                throw new Error('Email is invalid')
            }
        }
    },
    password : {
        type : String,
        required : true,
    },
    phone : {
        type : Number,
        minLength : 3,
        maxLength : 3
    },
    jwt : {
        type : String
    }
},
    {versionKey: false}
)

userSchema.pre('save',async function(next){
    if(this.isModified('password')==true)
    {
        try {
            this.password = await bcrypt.hash(this.password,10);
            next();
        } catch (error) {
            console.log(error);
        }
    }
})


userSchema.methods.createToken = async function()
{
    try {
        const token = JWT.sign({email:this.email},process.env.SECRET_KEY);
        this.jwt = token;
        await this.save()
        return token;
    } catch (error) {
        console.log(err);
    }
}

const User =  mongoose.model('User', userSchema);

module.exports = User