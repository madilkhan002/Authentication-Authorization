require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const user = require('./models/user');
const auth = require('./Controller/Auth')


app.use(cookieParser());
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req,res)=>{
  res.render('signin');
})

app.get('/signup',(req,res)=>{
  res.render('index');
})

app.post('/signup',async (req,res)=>{
  const User = new user(req.body);
  try {
    const result = await User.save();
    res.render('signin')

  } catch (error) {
    res.status(500).send(error);
  }
})

app.post('/signin',async(req,res)=>{
  const email =  req.body.email;
  const password = req.body.password;
  try {
    const User = await user.findOne({email});
    if(!User) return res.status(404).send('User Not Found');

    bcrypt.compare(password,User.password,async (err,result)=>{
      if(err){
        res.status(500).send(err)
      }else if(result == true){

        try {
          const token = await User.createToken();
          res.cookie('jwt',token,{
            httpOnly : true,
            maxAge : 300000
          });
        } catch (error) {
          console.log(error);
        }

        user.updateOne({email},{jwt : User.createToken()})

        res.status(200).send('Login Succeed');
      }else{
        res.status(404).send('Pass Not Matched');
      }
    })

  } catch (error) {
    res.status(404).send(error);
  }
})


app.get('/random',auth,(req,res)=>{
  res.render('random');
})

app.get('/logout', async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const verify = await JWT.verify(token,process.env.SECRET_KEY);
    await user.updateOne({ email: verify.email }, { $unset: { jwt: 1 } });
    res.clearCookie('jwt');
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});



app.listen(8000, () => console.log('Listening to PORT 8000.....'));
