var express = require('express');
var router = express.Router()
var bcrypt = require('bcrypt');
var User = require('../model/userModel');
var generator = require("generate-password")
var jwt = require('jsonwebtoken');
var formidable = require('formidable');
var cloudinary = require("cloudinary")
var dotenv = require('dotenv')
var axios = require('axios')
dotenv.config();

cloudinary.config({
  cloud_name: 'afrikal',
  api_key: '345824351715158',
  api_secret: '55TwfraW6ST15TGvq6tjHSF9NfA'
})
function auth(req,res,next){
  var token =req.header("authorization");
  if(token){
    var data = jwt.decode(token,"streamers");
    req.userID = data.id;
    req.username = data.username
    req.role = data.role==="support"?data.role:null
    next();
  }else res.json({error:"Please login to continue"})

}
function mailer(email,message,subject){
  const nodemailer = require('nodemailer');
      let transporter = nodemailer.createTransport({
        tls: {
          rejectUnauthorized: false
        },
        host: 'smtp.sendgrid.net',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "apikey", // generated ethereal user
          pass: process.env.SENDGRID_API_KEY // generated ethereal password
        }
      });
      // setup email data with unicode symbols
      const mailOptions = {
        from: `support@streamjar.com`, // sender address
        to: `${email}`, // list of receivers
        subject: subject, // Subject line
        // text: `${message}`, // plain text body
        html:`<body style="background:#f7f7f7"><div style="width:90%; background:#fff; margin:10px auto 20px;font-family:Verdana, Geneva, Tahoma, sans-serif"><div style="background:#F4EEE2; padding:10px;color:rgb(248, 150, 166)"><center><h3>React Angle</h3></center></div><div style="padding:30px">${message} </div> <div style="background:#eee;height:2px;margin:10px 0px"></div><div style="padding:40px 20px;font-size:0.7em;color:#bbb"><center>Questions? Get your answers here: <a href="www.streamjar.herokuapp.com/faq" style="color:blue">Help Center</a></a>.</center></div></div><div style="font-size:0.7em;text-align:center;color:#bbb;width:35%;margin:auto"> All rights reserved</div></body>`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(info)
        }
        // Preview only available when sending through an Ethereal account
      })
}
//user Sign in route
router.post('/api/login', function (req, res, next) {
  if(req.body.profile){
  }else{
    var { username, password } = req.body;
    var error = {}
    if (username == "") error.username = "This field is required";
    if (password == "") error.password = "This field is required";
    if (error.password || error.username) {
      return res.json({ "error": error })
    }
    var data = {
      username: username
    }
    User.findOne({
      username: username
    }).then((user) => {
      if (user) {
        data.id = user._id
          data.username = username;
          data.email = user.email;
          data.picture = user.profileDetails.picture;
          if(user.role=="support" && !user.country) data.role="support"
          bcrypt.compare(password, user.password).then((valid) => {
            if (valid) {
              var token = jwt.sign(data, "streamers").toString();
              res.header('x-auth', token).json({ "token": token });
            } else res.json({ "error":  "Please enter a valid username/password", "password": "incorrect password"  })
          }).catch((error) => (console.log(error)));
      } 
      else {
        res.json({ "error": "Please enter a valid username/password" })
      }
    }).catch((err)=>console.log(err))
  }
  
})

.post("/api/signup", (req, res, next) => {
  const { username, password, email, imageUrl} = req.body
  User.findOne({username:username}).then((user)=>{
    if(user) return res.json({error:"This username is not available"})
    User.findOne({ email: email }).then((user) => {
      if (user) return res.json({ error:  `${email} is is not available`})
      bcrypt.hash(password, 10).then((hash) => {
        User.create({
        password:hash, username, email, profileDetails:{picture:imageUrl} 
        })
          .then((user) => {
            if (user) {
              const token = jwt.sign({ ...user }, "streamers")
              var subject= "Account Registration"
              var message=`<center><p style="font-family:Verdana, Geneva, Tahoma, sans-serif"><small>Congratulations! your  account has successfully been Verified</small></p><h2>Please Sign in to continue</h2><p style="font-family:Verdana, Geneva, Tahoma, sans-serif"><small> click the button below to Sign in to your account.</small></p><p style="margin: 30px"> <a href="https://streamjar.com/signin" style="font-size:0.9em;text-decoration:none;color:#000;border:1px solid #777;background:transparent;padding:10px 50px;font-family:Verdana"> Sign in </a></p></center>`
              mailer(email,message,subject)
              res.json({ "success": "Account created successfully" })
            }
          }).catch((error) => { console.log(error); res.json({ error: { "server": "An error has occured" } }); })
      })
    })
  })
})
.post("/api/socialLogin", (req, res, next) => {
  const { username, password, email, imageUrl} = req.body
  User.findOne({username:username}).then((user)=>{
    if(user){
       return axios.post(`http://${req.headers.host}/api/login`,req.body)
       .then((response)=>{
         res.header('x-auth', response.data.token).json({ "token": response.data.token })
       }).catch((err)=>console.log(err))
    }
  })
})
  router.post("/api/changePassword",auth,(req,res)=>{
    const{oldPassword,newPassword} = req.body;
    User.findById(req.userID).then((user)=>{
    bcrypt.compare(oldPassword,user.password).then((match)=>{
      if(match){
        bcrypt.hash(newPassword,10).then((hash)=>{
          User.update({_id:req.userID},{password:hash}).then((done)=>{
            res.json({success:"password changed successfully"})
           })
        })
      } else res.json({error:"Password does not match"})
    })
    })
  })
  router.post("/api/search",(req,res)=>{
    var {query} = req.body
    User.find({"username":{$regex:query}}).then((users)=>res.json({users})).catch((err)=>console.log(err))
  })

router.post("/api/updateProfile",auth,(req,res)=>{

  User.findOneAndUpdate({"_id":req.userID},req.body).then((success)=>{
    if(success){
      res.json({success:"Your profile has been updated successful"})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})

router.get("/api/getProfile",auth,(req,res)=>{
  User.findById(req.userID).then((user)=>{
    if(user){
      res.json({user})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.get("/api/getUser",(req,res)=>{
  User.findOne({username:req.query.username}).then((user)=>{
    if(user){
      res.json({user})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.get("/api/getUsers",(req,res)=>{
  User.find().limit(10).then((users)=>{
      res.json({users})
  })
})

router.post('/api/reset', (req, res) => {
  const { email } = req.body;
  let token;
  var date = new Date();
  User.findOne({ email }).then((user) => {
    if (user) {
      const password = generator.generate({
        length: 10,
        numbers: true
      });
      const hashedPassword = bcrypt.hashSync(password, 10);
      token = jwt.sign({ password: hashedPassword, email: email, date }, "streamers")
      // setup email data with unicode symbols
      const message = `<h4>Hi there</h4>
            <p>You have successfully reset your password. Here is your new password for future reference: ${password}.</p>
            <p>Thank you!</p>
          `;
      const subject = "Password reset"
      mailer(email,message,subject)
          User.findOneAndUpdate({ email }, { password: hashedPassword }).then((pass) => {
            if (pass) {
              res.json({ "success": "Your password has been reset successfully. Please check your inbox" })
        }
        // Preview only available when sending through an Ethereal account
      })
    } else res.json({ error: "Please try again later" })
  }
  );
})
  .post('/api/uploadPictures', (req, res, next) => {
    var newform = new formidable.IncomingForm();
    newform.keepExtensions = true;
    newform.parse(req, (err, fields, files) => {
      if (files.picture)
        cloudinary.uploader.upload(files.picture.path, function (result) {
          if (result.url) {
            let userData = jwt.decode(fields.token)
            let time = new Date();
            var ulimit = files.picture.size/1000000;
            console.log(ulimit)
            User.update({ _id: userData.id }, { $inc: { uploadCounter: +ulimit } }).then((succ)=>console.log(succ))
            Post.findOneAndUpdate({username:userData.username},{$addToSet:{content:{
              type: "image",
              userID: userData.id,
              imgUrl: result.url,
              date: time,
              description: fields.description
            }}
          }).then((success) => { if(success)res.json({ url: result.url, success: "uploaded successfully" }) }).catch((err)=>console.log(err))
          } else {
            res.json({ error: "Error uploading the image" }); console.log("error uploading to cloudinary")
          }
        }); else res.json({ error: "Please choose an image to upload" });
    })
  })
module.exports = router;
