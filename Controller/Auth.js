const JWT = require('jsonwebtoken');
const user = require('../models/user')
const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verify = await JWT.verify(token,process.env.SECRET_KEY);
        const User = await user.findOne({email : verify.email});
        if(User)
        {
            next();
        }else{
            res.redirect('/');
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = auth;