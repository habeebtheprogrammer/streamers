var express = require('express');
var router = express.Router()
var bcrypt = require('bcrypt');
var User = require('../model/userModel');
var Reviews = require('../model/reviewModel');
var Message = require('../model/messages');
var Newsletter = require('../model/newsletter');
var generator = require("generate-password")
var jwt = require('jsonwebtoken');
var formidable = require('formidable');
var cloudinary = require("cloudinary")
var dotenv = require('dotenv')

dotenv.config();

cloudinary.config({
  cloud_name: 'afrikal',
  api_key: '345824351715158',
  api_secret: '55TwfraW6ST15TGvq6tjHSF9NfA'
})
function auth(req,res,next){
  var token =req.header("authorization");
  if(token){
    var data = jwt.decode(token,"1864");
    req.userID = data.id;
    req.username = data.username
    req.role = data.role==="support"?data.role:null
    next();
  }else res.json({error:"Please login to continue"})

  
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
          data.firstname= user.firstName;
          data.lastname= user.lastName;
          data.country = user.country;
          if(user.role=="support" && !user.country) data.role="support"
          bcrypt.compare(password, user.password).then((valid) => {
            if (valid) {
              var token = jwt.sign(data, "1864").toString();
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
  let time = new Date();
  const { username, password, firstName, lastName, email, country} = req.body
  User.findOne({username:username}).then((user)=>{
    if(user) return res.json({error:"This username is not available"})
    User.findOne({ email: email }).then((user) => {
      if (user) return res.json({ error:  `${email} is is not available`})
      bcrypt.hash(password, 10).then((hash) => {

        User.create({
        password:hash, username, firstName, lastName, email, country
        })
          // newUser.save()
          .then((user) => {
            if (user) {
              const token = jwt.sign({ ...user }, "1864")
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
              let mailOptions = {
                from: '"Reactangle" <info@reactangle.com>', // sender address
                to: `${email}`, // list of receivers
                subject: 'Account Registration ✔', // Subject line
                text: 'Hello?', // plain text body
                headers: {
                  "X-SMTPAPI": {
                    "category": [
                      "Orders"
                    ]
                  }
                },
                html: ' <body style="background:#f7f7f7"><div style="width:90%; background:#fff; margin:10px auto 20px;font-family:Verdana, Geneva, Tahoma, sans-serif"><div style="background:#F4EEE2; padding:10px;color:rgb(248, 150, 166)"><center><h3>reactangle</h3></center></div><div style="padding:30px"><center><p style="font-family:Verdana, Geneva, Tahoma, sans-serif"><small>Congratulations! your  account has successfully been Verified</small></p><h2>Please Sign in to continue</h2><p style="font-family:Verdana, Geneva, Tahoma, sans-serif"><small> click the button below to Sign in to your account.</small></p><p style="margin: 30px"> <a href="https://reactangle.com/signin" style="font-size:0.9em;text-decoration:none;color:#000;border:1px solid #777;background:transparent;padding:10px 50px;font-family:Verdana"> Sign in </a></p></center></div><div style="background:#eee;height:2px;margin:10px 0px"></div><div style="padding:40px 20px;font-size:0.7em;color:#bbb"><center>Questions? Get your answers here: <a href="" style="color:blue">Help Center</a></a>.</center></div></div><div style="font-size:0.7em;text-align:center;color:#bbb;width:35%;margin:auto">Tanke | , Ilorin, 224230 | Copyright © 2018 | All rights reserved</div></body>' // html body
              };

              // send mail with defined transport object
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
              });
              // });
              res.json({ "success": "Account created successfully" })
            }
          }).catch((error) => { console.log(error); res.json({ error: { "server": "An error has occured" } }); })

      })
    })
  })


  // }
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

router.get("/api/getReviews",(req,res)=>{
  Reviews.find().sort({"_id":-1}).populate("userID",{"firstName":"firstName","lastName":"lastName","username":"username","country":"country"}).exec().then((reviews)=>{
    if(reviews)res.json({reviews})
  })
})
router.get("/api/getMessages",auth,(req,res)=>{
  req.role==="support"?
  Message.find().sort({"_id":-1}).populate("senderID",{"username":"username","firstName":"firstName","lastName":"lastName","email":"email","country":"country",regDate:"regDate",description:"description"}).exec().then((messages)=>{
    if(messages)res.json({messages})
  }) :
  Message.find({senderID:req.userID}).sort({"_id":-1}).then((messages)=>{
    if(messages)res.json({messages})
  }) 
})
router.get("/api/getRequestById",auth,(req,res)=>{
  var {r,c} = req.query;
  
  Message.findById({_id:c}).then((conv)=>{
    if(conv){
     var order,offer={}; var ticket = conv.ticket;
     conv.conversation.map((msg)=>{
       if(msg.requestBudget)  order = msg.message;
       if(msg._id==r){
        offer.offerDesc = msg.offerDesc
        offer.offerTitle = msg.offerTitle
        offer.offerBudget = msg.offerBudget
        offer.offerDeadline = msg.offerDeadline
      }
     });
     offer.order = order;
     offer.ticket = ticket;
     if(offer.order) res.json({offer})
    }
  }) 
})

router.post("/api/updateChat",auth,(req,res)=>{
  var {message,conversationID} = req.body;
  Message.update({ _id: conversationID }, {updated:new Date(), $push: { conversation: { message, senderID:req.userID} } })
  .then((success)=>{
    res.json({data:{message,senderID:req.userID, date:new Date()},conversationID})
  })
})
router.post("/api/createOffer",auth,(req,res)=>{
  var {offerTitle,offerDesc,offerBudget,offerDeadline,conversationID} = req.body;
  Message.update({ _id: conversationID }, {updated:new Date(), $push: { conversation: {offerTitle,offerDesc,offerBudget,offerDeadline,senderID:req.userID,message:"Here is an offer"} } })
  .then((success)=>{
    console.log(conversationID)
    res.json({data:{offerTitle,offerDesc,offerBudget,offerDeadline,senderID:req.userID, date:new Date()},conversationID})
  }).catch((err)=>console.log(err))
})
router.post("/api/submitReview",auth,(req,res)=>{
  var {rating,review} = req.body;
  Reviews.create({rating,review,userID:req.userID})
  .then((succ)=>res.json({succ:"Your review has been submited successfully, Thank you"})).catch((error)=>console.log(error))
})
router.post("/api/submitRequest",auth,(req,res)=>{
  var {message,price} = req.body;  
  var ticket = generator.generate({
    length: 10,
    numbers: true
  });
  Message.create({ticket,senderID:req.userID,updated:new Date(),conversation:{senderID:req.userID,message,requestBudget:price}})
  .then((success)=>res.json({success:"Your request has been submited successfully. Please check your inbox"})).catch((error)=>{console.log(error);res.json({error:"An error has occured. please try again later"})})
})
router.post("/api/submitNewsletter",(req,res)=>{
  Newsletter.findOne({email: req.body.email}).then((exist)=>{
    if(exist === null){
        Newsletter.create({email:req.body.email}).then((success)=>res.json({success:'You have successfully opted in for our monthly newsletter. Thank you'}))
}else res.json({error:"You currently have an active subscription"})
  }).catch((err)=>console.log(err))
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
      token = jwt.sign({ password: hashedPassword, email: email, date }, "1864")
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
      const message = `<h4>Hi there</h4>
            <p>You have successfully reset your password. Here is your new password for future reference: ${password}.</p>
            <p>Thank you!</p>
          `;
      const mailOptions = {
        from: `support@kampuskonnect.com`, // sender address
        to: `${email}`, // list of receivers
        subject: `Password Reset`, // Subject line
        // text: `${message}`, // plain text body
        html: ' <body style="background:#f7f7f7"><div style="width:90%; background:#fff; margin:10px auto 20px;font-family:Verdana, Geneva, Tahoma, sans-serif"><div style="background:#F4EEE2; padding:10px;color:rgb(248, 150, 166)"><center><h3>kampus konnect</h3></center></div><div style="padding:30px"><center><p style="font-family:Verdana, Geneva, Tahoma, sans-serif"><small>You have successfully reset your password. Here is your new password for future reference</small></p><h2>' + password + '</h2><p style="font-family:Verdana, Geneva, Tahoma, sans-serif"><small>Please click on this button below to change your password.</small></p><p style="margin: 30px"> <a href="https://kampuskonnect.herokuapp.com/reset_password/' + token + '" style="font-size:0.9em;text-decoration:none;color:#000;border:1px solid #777;background:transparent;padding:10px 50px;font-family:Verdana"> Change your password</a></p></center></div><div style="background:#eee;height:2px;margin:10px 0px"></div><div style="padding:40px 20px;font-size:0.7em;color:#bbb"><center>Questions? Get your answers here: <a href="www.kampuskonnect.herokuapp.com/faq" style="color:blue">Help Center</a></a>.</center></div></div><div style="font-size:0.7em;text-align:center;color:#bbb;width:35%;margin:auto"> All rights reserved</div></body>' // html body
        // html body

      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.json({ "error": "Please try again later." })
        } else {
          console.log(info)
          User.findOneAndUpdate({ email }, { password: hashedPassword }).then((pass) => {
            if (pass) {
              res.json({ "success": "Your password has been reset successfully. Please check your inbox" })
            }
          })
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
