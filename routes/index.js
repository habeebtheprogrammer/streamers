var express = require('express');
var router = express.Router()
var bcrypt = require('bcrypt');
var User = require('../model/userModel');
var Newsletter = require('../model/newsletter');
var Message = require("../model/message")
var Picture = require('../model/pictures');
var Groupchat= require("../model/groupchat")
var Grouppost = require('../model/grouppost');
var Newsfeed = require('../model/newsfeed');
var Video = require('../model/videos');
var Friends = require('../model/friends');
var Groups = require('../model/groups');
var Sectionpost = require('../model/sectionposts');
var moment = require('moment')
var generator = require("generate-password")
var jwt = require('jsonwebtoken');
var formidable = require('formidable');
var fs = require("fs")
var cloudinary = require("cloudinary")
var dotenv = require('dotenv')
var path  = require ('path')
dotenv.config();

cloudinary.config({
  cloud_name: 'afrikal',
  api_key: '345824351715158',
  api_secret: '55TwfraW6ST15TGvq6tjHSF9NfA'
})


//nodemailer

//user login route
router.post('/api/login', function (req, res, next) {
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
       data.setup=user.interest.length?true:false
      data.id = user._id
      data.fullName = user.fullName,
        data.department = user.department,
        data.location = user.location,
        data.gender = user.gender,
        data.university = user.university,
        data.username = user.username,
        data.dp = user.dpUrl,
        data.regDate = user.date,
        // console.log(user)
        bcrypt.compare(password, user.password).then((valid) => {
          if (valid) {
            var token = jwt.sign(data, "h1a2b3e4e5b6").toString();
            res.header('x-auth', token).json({ "token": token });
          } else res.json({ "error":  "Please enter a valid username/password", "password": "incorrect password"  })
        }).catch((error) => (console.log(error)));
    } else res.json({ "error": "Please enter a valid username/password", "password": "incorrect password" })
  })
})

  .post("/api/signup", (req, res, next) => {
    let time = new Date();
    const { username, password, fullName, email, department, university ,gender} = req.body
    User.findOne({username:username}).then((user)=>{
      if(user) return res.json({error:"This username is not available"})
      User.findOne({ email: email }).then((user) => {
        if (user) return res.json({ error:  "This email address is not available"})
        bcrypt.hash(password, 10).then((hash) => {

          User.create({
            username, password:hash, fullName, email,gender
          })
            // newUser.save()
            .then((user) => {
              if (user) {
                const token = jwt.sign({ ...user }, "o1l2a3m4i5d6e")
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
                  from: '"Iflickr 👻" <info@iflickr.com>', // sender address
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
                  html: ' <body style="background:#f7f7f7"><div style="width:90%; background:#fff; margin:10px auto 20px;font-family:Verdana, Geneva, Tahoma, sans-serif"><div style="background:#F4EEE2; padding:10px;color:rgb(248, 150, 166)"><center><h3>Iflickr</h3></center></div><div style="padding:30px"><center><p style="font-family:Verdana, Geneva, Tahoma, sans-serif"><small>Congratulations! your  account has successfully been Verified</small></p><h2>Please login to continue</h2><p style="font-family:Verdana, Geneva, Tahoma, sans-serif"><small> click the button below to login to your account.</small></p><p style="margin: 30px"> <a href="https://iflickr.herokuapp.com/login" style="font-size:0.9em;text-decoration:none;color:#000;border:1px solid #777;background:transparent;padding:10px 50px;font-family:Verdana"> Login </a></p></center></div><div style="background:#eee;height:2px;margin:10px 0px"></div><div style="padding:40px 20px;font-size:0.7em;color:#bbb"><center>Questions? Get your answers here: <a href="" style="color:blue">Help Center</a></a>.</center></div></div><div style="font-size:0.7em;text-align:center;color:#bbb;width:35%;margin:auto">Tanke | , Ilorin, 224230 | Copyright © 2018 | All rights reserved</div></body>' // html body
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
                Friends.create({username:user.username,userID:user._id})
                .then((succ)=>{
                  console.log(succ)
                }).catch((err)=>console.log(err))
                res.json({ "success": "Account Created Successfully" })

              }
            }).catch((error) => { console.log(error); res.json({ error: { "server": "An error has occured" } }); })

        })
      })
    })
  
  
    // }
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
      token = jwt.sign({ password: hashedPassword, email: email, date }, "o1l2a3m4i5d6e")
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
router.post('/api/editprofile', function (req, res, next) {
  let {  firstName, lastName, phone,city,state,dob, token } = req.query;
  let time = new Date();
  let data = {}
  if (fullName !== "") data.fullName = fullName
  if (phone !== "") data.phone = phone
  if (city !== "") data.city = city
  if (state !== "") data.state = state
  if (dob !== "") data.dob = dob
  if (location !== "") data.location = location
  if (about !== "") data.about = about
  if (bio !== "") data.bio = bio
  let userData = jwt.decode(token)
  data.userid = userData.id;
  data.time = time;
  User.findOneAndUpdate({ userid: userData.id }, data).then((user) => {
    if (user) {
      res.json({ "success": "Contact form modified successfully" })
    } else {
      var newForm = new Contactform(data);
      newForm.save().then((user) => {
        if (user) res.json({ "success":"Contact form Created Successfully" })
      }).catch((error) => { console.log(error); res.json({ error:"An error has occured" }); })
    }
  }).catch((err) => { res.json({ error: "An error has occured. Please try again later"  }); console.log(err) })


})
router.post('/api/resetpassword', (req, res) => {
  const { token, cpassword } = req.body;
  var userData = jwt.decode(token, "o1l2a3m4i5d6e")
  var date = new Date();
  var time1 = moment(date).add(5, "minutes")
  if (moment(userData.date).isBefore(date)) {
    if (jwt.verify(token, "o1l2a3m4i5d6e"));
    User.findOne({ email: userData.email, password: userData.password }).then((user) => {
      if (user) {
        const hashedPassword = bcrypt.hashSync(cpassword, 10);

        User.findOneAndUpdate({ email: userData.email }, { password: hashedPassword }).then((pass) => {
          if (pass) {
            res.json({ "success": "Your password has been reset successfully. You can now login" })
          }
        })

      } else res.json({ error: "You are not authorize to perform this action" })
    })
  } else res.json({ error: "This link has expired" })
})
router.post('/api/subscribe', (req, res) => {
  const { email, firstName, lastName, country } = req.body;
  Newsletter.findOne({ email }).then((user) => {
    if (user) {
      res.json({ error: "You are already on a subscription" })
    } else {
      Newsletter.create({ email, firstName, lastName, country }).then((suc) => { if (suc) res.json({ success: "Your subscription was successful" }); else res.json({ error: "Please try again later" }) })
    }
  }
  );
})
//check for available email
router.post('/api/checkEmail', (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      res.json({ "error": { "email": req.body.email + " is not available" } })
    } else res.json({ "success": { "email": "This email address is available" } })

  }).catch((err) => res.json({ "error": { "email": "an error has occured" } }))
})
router.post('/api/checkUsername', (req, res, next) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      res.json({ "uerror": req.body.username + " is not available" })
    } else res.json({ "usuccess": "This username is available" })

  }).catch((err) => res.json({ "uerror": "an error has occured" }))
})
router.get("/api/getusers", (req, res, next) => {

  User.find().then((users) => {
    if (users) {
      res.json({ users: users })
    } else (res.json({ empty: "There are no users available" }))
  }).catch((err) => console.log(err))
})
router.get("/api/get6users", (req, res, next) => {

  User.find().limit(6).then((users) => {
    if (users) {
      res.json({ users: users })
    } else (res.json({ empty: "There are no users available" }))
  }).catch((err) => console.log(err))
})
router.get("/api/getuserbyid", (req, res, next) => {
  User.findOne({username:req.query.id}).then((users) => {
    if (users) {

      res.json({ user: users })
    } else (res.json({ empty: "this  is not available" }))
  }).catch((err) => console.log(err))
})
router.get("/api/dashboard", (req, res, next) => {
  User.findById(req.query.id).then((users) => {
    if (users) {

      res.json({ user: users })
    } else (res.json({ empty: "this  is not available" }))
  }).catch((err) => console.log(err))
})
router.post("/api/grabmessages", (req, res, next) => {
  Message.findOne({party:req.body.party}).then((mesg) => {
    if(mesg)  res.json({ mesg:mesg,success:true }); else res.json({success:false})
  }).catch((err) => console.log(err))
})
router.post("/api/conversation", (req, res, next) => {
  var allmesg=[];
  Message.find({ user1: req.body.username }).then((mesg) => {
    Message.find({ user2: req.body.username }).then((mesg2) => {
     allmesg= mesg.concat(mesg2)
      res.json({ allmesg: allmesg});
    })
  })
})
.post("/api/postStatus", (req, res, next) => {
  let userData = jwt.decode(req.body.token)
  let status = req.body.status
  User.findOneAndUpdate({ _id: userData.id }, { status:status}).then((user) => {
    if (user) res.json({ status: req.body.status }); else res.json({ error: "An error has occured" })
  })
})
.post("/api/updateProfile", (req, res, next) => {
  let userData = jwt.decode(req.body.token)
  var {interest,skillset,languages,knowledge,status} = req.body
  data = {}
  if(interest.length) data.interest = interest;
  if(skillset.length) data.skillset = skillset;
  if(languages.length) data.languages = languages;
  if(knowledge.length) data.knowledge = knowledge;
  if(status) data.languages = status;
  User.findOneAndUpdate({ _id: userData.id }, { ...data}).then((user) => {
    if (user) res.json({ success: true }); else res.json({ error: "An error has occured" })
  })
})
.post("/api/postGroupDescription", (req, res, next) => {
  let {description,groupID} = req.body
  Groups.findOneAndUpdate({ _id: groupID}, { description}).then((success) => {
    if (success) res.json({ success: true }); else res.json({ error: "An error has occured" })
  })
})
  .get("/api/search", (req, res, next) => {
    var searchText = `${req.query.a||""} ${req.query.b||""} ${req.query.c||""}`
    var result ={}
    var filter ={};
    if(req.query.gender) filter.gender=req.query.gender;
    console.log(searchText)
    var {type} = req.query;
    if(type==="people"){
      User.find({ ...filter,$text: { $search: searchText }}, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).then((data) => { 
        result.users = data
        res.json({result,type:"users"})
      }).catch((err)=>console.log(err))
    }
    else if(type==="thread"){
      Sectionpost.find({ $text: { $search: searchText }}, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"}).then((data) => { 
        result.threads = data
        res.json({result,type:"thread"})
      }).catch((err)=>console.log(err))
    }
    else if(type==="community"){
      User.find({ $text: { $search: searchText }}, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).then((data) => { 
        result.groups = data
        res.json({result,type:"community"})
      }).catch((err)=>console.log(err))
    }
  })
  .get("/api/searchGroup", (req, res, next) => {
    var searchText = `${req.query.name}`
    Groups.find({ $text: { $search: searchText }}, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).populate("creatorID",{fullName:"fullName",department:"department",username:"username",university:"university"}).exec().then((data) => { if (data) res.json({ result: data }) })
    .catch((err)=>console.log(err))

  })
   .get("/api/relatedusers", (req, res, next) => {
    var searchText = `${req.query.dept} ${req.query.uni}`
    User.find({ $text: { $search: searchText }}, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).then((data) => { if (data) res.json({ result: data }) })

  })
  .get("/api/getImagesByUser", (req, res, next) => {
    Picture.find({username: req.query.username}).sort({ _id: -1 }).populate("username").exec().then((picture) => {
      if (picture) {
        res.json({ success: picture })
      } else (res.json({ error: "There are no images available" }))
    })
  })
  .get("/api/getVideosByUser", (req, res, next) => {
    Video.find({username: req.query.username}).sort({ _id: -1 }).then((videos) => {
      if (videos) {
        res.json({ success: videos })
      } else (res.json({ error: "There are no images available" }))
    })
  })
  .get("/api/getTimeline", (req, res, next) => {
    Sectionpost.find({username: req.query.username}).sort({date:-1}).populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("comments.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"}).
    exec().then((posts) => { if(posts)res.json({posts})
})
  })
  .get("/api/fetchGroupById", (req, res, next) => {

    Groups.findById( req.query.id).populate("creatorID",{fullName:"fullName",department:"department",username:"username",university:"university"})
    .populate("members.userID",{fullName:"fullName",department:"department",username:"username",university:"university"}).exec().then((group) => {
      // media.push({pictures})
      if(group)
      res.json({ group:group })
  }).catch((err)=>console.log(err))
  })
  .get("/api/fetch5Groups", (req, res, next) => {
    Groups.find().limit(5).then((groups) => {
      if(groups)
      res.json({groups})
  }).catch((err)=>console.log(err))
  })
  .get("/api/fetch4Post", (req, res, next) => {
    Sectionpost.find().sort({date:-1}).limit(2)
    .populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .exec().then((posts) => {
      if(posts)
      res.json({posts})
  }).catch((err)=>console.log(err))
  })
  .get("/api/fetchGroupPostNewsFeed", (req, res, next) => {
    Grouppost.find({groupID:req.query.id}).sort({date:-1}).populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("comments.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"}).
    exec().then((posts) => {
     
      res.json({ posts: posts })
  })
  })

  .get("/api/getSectionFeeds", (req, res, next) => {
    Sectionpost.find({section:req.query.section}).sort({date:-1}).populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("comments.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"}).
    exec().then((posts) => {
      res.json({ posts: posts })
  })
  })
  .get("/api/getSectionHomeFeeds", (req, res, next) => {
    Sectionpost.find().sort({date:-1}).populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("comments.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"}).
    exec().then((posts) => {
     
      res.json({ posts: posts })
  })
  })

  .get("/api/getSectionFpFeeds", (req, res, next) => {
    Sectionpost.find().sort({date:-1}).populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("comments.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("comments.reply.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"}).
    exec().then((posts) => {
      res.json({ posts: posts })
  })
  })
  .get("/api/getSectionPostById", (req, res, next) => {
    Sectionpost.findById(req.query.id).populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("comments.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("comments.reply.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"}).
    exec().then((post) => {
      if(post){
        Sectionpost.update({_id:req.query.id},{$inc:{views:+1}}).then((suc)=>console.log(suc))
        res.json({ post: post })
      }
  })
  })
  .get("/api/getFriends", (req, res, next) => {
    Friends.findOne({username:req.query.username}).populate("list.userID",{fullName:"fullName",username:"username",status:"status"}).exec().then((friends)=>{
      res.json({friends:friends})
    })
  })
   .post("/api/sendFriendRequest", (req, res, next) => {
    var check = jwt.verify(req.body.token,"o1l2a3m4i5d6e");
    if(check){
    var items = jwt.decode(req.body.token);
    var {id,username,
      rUsername, rID} = items
    
    Friends.findOneAndUpdate({userID:id,username:username},{ $addToSet:{ list:{type:"sent",userID:rID,username:rUsername}}})
    .then((succ)=>{ console.log(succ)
      if(!succ){
        Friends.create({userID:id,username:username}).then((done)=>{
          if(done){
            Friends.update({userID:id,username:username},{ $addToSet:{ list:{type:"sent",userID:rID,username:rUsername}}})
            .then((update)=>{})
          }
        })
      }
    }).catch((err)=>console.log(err))
    Friends.findOneAndUpdate({username:rUsername,userID:rID},{ $addToSet:{ list:{type:"request",userID:id,username}}})
            .then((succ)=>{ 
              if(succ){
                res.send({success:true})
              }else{
                Friends.create({username:rUsername,userID:rID}).then((done)=>{
                  if(done){
                    Friends.update({username:rUsername,userID:rID},{  $addToSet:{ list:{type:"request",userID:id,username}}})
                    .then((update)=>{if(update) res.send({success:true})})
                  }
                })
              }
            }).catch((err)=>console.log(err))
    }
    
  })
  .post("/api/acceptRequest", (req, res, next) => {
    var check = jwt.verify(req.body.token,"o1l2a3m4i5d6e");
    if(check){
    var items = jwt.decode(req.body.token);
    var {id,username, university,department,fullName,gender,
      rUsername, rID,rFullName, rUniversity,rDepartment,rGender} = items
    Friends.update({userID:id,username:username,"list.userID":rID},{
      "list.$.type":"friend"
    }).then((succ)=>{ console.log(succ)
    }).catch((err)=>console.log(err))
    // Friends.update({userID:id,username:username},
    // {  $pull:{ list:{userID:rID,type:"request"}}   }
    // ).then((succ)=>console.log(succ))
    console.log(rUsername,rID,username,id)
    Friends.update({username:rUsername,userID:rID,"list.userID":id},{
      "list.$.type":"friend"
    }) .then((done)=>{  if(done.nModified) res.json({success:true}) }).catch((err)=>console.log(err))
    // Friends.update({username:rUsername,userID:rID},
    //   { $addToSet:{ list:{type:"friend",userID:id,fullName,department,university,gender,username}}
    // }) .then((succ)=>{  if(succ)res.send({success:true})}).catch((err)=>console.log(err))
    }
  })
  .post("/api/acceptGroupRequest", (req, res, next) => {
    var check = jwt.verify(req.body.token,"o1l2a3m4i5d6e");
    if(check){
    var items = jwt.decode(req.body.token);
    var {groupID, userID} = items
   
    Groups.update({_id:groupID},
      {$pull:{"members":{userID}}}
    ).then((succ)=>{
    }).catch((err)=>console.log(err))
    Groups.update({_id:groupID},
      {  $addToSet:{ members:{userID,type:"member"}}}
    ).then((succ)=>{
      if(succ)res.send({success:true})
    }).catch((err)=>console.log(err))
  }
  })
  .post("/api/sendGroupRequest", (req, res, next) => {
    var check = jwt.verify(req.body.token,"o1l2a3m4i5d6e");
    if(check){
    var items = jwt.decode(req.body.token);
    var {groupID, userID} = items
    Groups.update({_id:groupID},
      {  $addToSet:{ members:{userID,type:"request"}}}
    ).then((succ)=>{
      if(succ)res.send({success:true})
    }).catch((err)=>console.log(err))
  }
} )

.post("/api/postReplyComment",(req,res,next)=>{
  let {text,userID,postID,commentID} = req.body
  Sectionpost.update({_id:postID,"comments._id":commentID},{$addToSet:{"comments.$.reply":{
    description:text, userID
  }}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/postNfReplyComment",(req,res,next)=>{
  let {text,userID,postID,commentID} = req.body
  Newsfeed.update({_id:postID,"comments._id":commentID},{$addToSet:{"comments.$.reply":{
    description:text, userID
  }}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/postGroupReplyComment",(req,res,next)=>{
  let {text,userID,postID,commentID} = req.body
  Grouppost.update({_id:postID,"comments._id":commentID},{$addToSet:{"comments.$.reply":{
    description:text, userID
  }}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/postForumComment",(req,res,next)=>{
  let {description,userID,postID} = req.body
  Sectionpost.update({_id:postID},{$addToSet:{"comments":{
    description, userID
  }}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/postNfComment",(req,res,next)=>{
  let {description,userID,postID} = req.body
  Newsfeed.update({_id:postID},{$addToSet:{"comments":{
    description, userID
  }}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/postGroupComment",(req,res,next)=>{
  let {description,userID,postID} = req.body
  Grouppost.update({_id:postID},{$addToSet:{"comments":{
    description, userID
  }}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/likeForumComment",(req,res,next)=>{
  let {userID,postID,creatorID,commentID} = req.body
  Sectionpost.update({_id:postID,"comments._id":commentID},{$addToSet:{"comments.$.likes":userID
}}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
}) 
.post("/api/likeNfComment",(req,res,next)=>{
  let {userID,postID,creatorID,commentID} = req.body
  Newsfeed.update({_id:postID,"comments._id":commentID},{$addToSet:{"comments.$.likes":userID
}}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
}) 
.post("/api/unLikeForumComment",(req,res,next)=>{
  let {userID,postID,creatorID,commentID} = req.body
  Sectionpost.update({_id:postID,"comments._id":commentID},{$pull:{"comments.$.likes":userID
}}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
}) 
.post("/api/unLikeNfForumComment",(req,res,next)=>{
  let {userID,postID,creatorID,commentID} = req.body
  Newsfeed.update({_id:postID,"comments._id":commentID},{$pull:{"comments.$.likes":userID
}}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
}) 
.post("/api/likeGroupComment",(req,res,next)=>{
  let {userID,postID,creatorID,commentID} = req.body
  Grouppost.update({_id:postID,"comments._id":commentID},{$addToSet:{"comments.$.likes":userID
}}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
}) 
.post("/api/unLikeGroupComment",(req,res,next)=>{
  let {userID,postID,creatorID,commentID} = req.body
  Grouppost.update({_id:postID,"comments._id":commentID},{$pull:{"comments.$.likes":userID
}}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
}) 
.post("/api/followPost",(req,res,next)=>{
  let {followerID,postID} = req.body
  Sectionpost.update({"_id":postID},{$addToSet:{"followers":followerID}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/followGroupPost",(req,res,next)=>{
  let {followerID,postID} = req.body
  Grouppost.update({"_id":postID},{$addToSet:{"followers":followerID}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/unFollowPost",(req,res,next)=>{
  let {followerID,postID} = req.body
  Sectionpost.update({"_id":postID},{$pull:{"followers":followerID}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/unFollowGroupPost",(req,res,next)=>{
  let {followerID,postID} = req.body
  Grouppost.update({"_id":postID},{$pull:{"followers":followerID}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/flagPost",(req,res,next)=>{
  let {userID,postID} = req.body
  Sectionpost.update({"_id":postID},{$addToSet:{"flag.userID":userID},$inc:{"flag.users":+1}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/unFlagPost",(req,res,next)=>{
  let {userID,postID} = req.body
  Sectionpost.update({"_id":postID},{$pull:{"flag.userID":userID},$inc:{"flag.users":-1}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.get("/api/getNewsfeed", (req, res, next) => {
   Newsfeed.find().sort({date:-1}).populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
  .populate("comments.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
  .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"}).
  populate("comments.reply.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"}).
  exec().then((posts) => {
    res.json({ posts: posts })
})
})
.get("/api/getFollowedPost",(req,res,next)=>{
  let {followerID} = req.query
  Sectionpost.find({"followers":{$all:followerID}
}).sort({date:-1})

.populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("comments.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
.then((posts) => {console.log(posts); if(posts)res.json({ posts:posts }) }).catch((err)=>console.log(err))
})

.get("/api/getTrendingPost",(req,res,next)=>{
  Sectionpost.find().limit(10).sort({views:-1})

.populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("comments.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
.then((posts) => {console.log(posts); if(posts)res.json({ posts:posts }) }).catch((err)=>console.log(err))
})
.get("/api/get3TrendingPost",(req,res,next)=>{
  Sectionpost.find().limit(3).sort({views:-1})

.populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("comments.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
.then((posts) => {console.log(posts); if(posts)res.json({ posts:posts }) }).catch((err)=>console.log(err))
})
.get("/api/getGroupFollowedPost",(req,res,next)=>{
  let {followerID} = req.query
  Grouppost.find({"followers":{$all:followerID}
}).sort({date:-1})

.populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("comments.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
.then((posts) => { if(posts)res.json({ posts:posts }) }).catch((err)=>console.log(err))
})
.get("/api/getCommentedPost",(req,res,next)=>{
  let {userID} = req.query
  Sectionpost.find({"comments":{$elemMatch:{userID:userID}}
}).sort({date:-1})
.populate("userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("comments.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"}).
    then((posts) => {console.log(posts); if(posts)res.json({ posts:posts }) }).catch((err)=>console.log(err))
})
.get("/api/getLikesPost",(req,res,next)=>{
  let {userID} = req.query
  Sectionpost.find({likes:{$all:userID}
}).sort({date:-1})
.populate("userID",{fullName:"fullName",username:"username",department:"department",university:"university",dpUrl:"dpUrl"})
    .populate("comments.userID",{fullName:"fullName",username:"username",dpUrl:"dpUrl"})
    .populate("likes",{fullName:"fullName",username:"username",dpUrl:"dpUrl"}).
    then((posts) => {console.log(posts); if(posts)res.json({ posts:posts }) }).catch((err)=>console.log(err))
})
.post("/api/likeForumPost",(req,res,next)=>{
  let {userID,postID,creatorID} = req.body
  Sectionpost.update({userID: creatorID,_id:postID},{$addToSet:{"likes":userID}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/unLikeForumPost",(req,res,next)=>{
  let {userID,postID,creatorID} = req.body
  Sectionpost.update({userID: creatorID,_id:postID},{$pull:{"likes":userID}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/likeNfPost",(req,res,next)=>{
  let {userID,postID,creatorID} = req.body
  Newsfeed.update({userID: creatorID,_id:postID},{$addToSet:{"likes":userID}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/unLikeNfPost",(req,res,next)=>{
  let {userID,postID,creatorID} = req.body
  Newsfeed.update({userID: creatorID,_id:postID},{$pull:{"likes":userID}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/likeGroupPost",(req,res,next)=>{
  let {userID,postID,creatorID} = req.body
  Grouppost.update({userID: creatorID,_id:postID},{$addToSet:{"likes":userID}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/unLikeGroupPost",(req,res,next)=>{
  let {userID,postID,creatorID} = req.body
  Grouppost.update({userID: creatorID,_id:postID},{$pull:{"likes":userID}
}).then((success) => { if(success)res.json({ success: true }) }).catch((err)=>console.log(err))
})
.post("/api/createGroup",(req,res,next)=>{
  let userData = jwt.decode(req.body.token)
  let title = req.body.title
  Groups.create({title,creatorID:userData.id,members:{userID:userData.id,type:"member"}
}).then((group) => { if(group){
  res.json({ success: true })
 } }).catch((err)=>console.log(err))
})
.post("/api/postToGroup",(req,res,next)=>{
  let check = jwt.verify(req.body.token,"h1a2b3e4e5b6");
  var token;
  if(check){
     token = jwt.decode(req.body.token);
        Grouppost.create({userID:req.body.userID,username:req.body.username,description: req.body.description,groupID:req.body.groupID})
     .then((done)=>(res.json({success:true})))
    }  else res.json({success:true})
})

.post("/api/sectionPost",(req,res,next)=>{
  var {userID,description,section,title,username} = req.body
     Sectionpost.create({userID,description,type:"sectionpost",title,section,username})
     .then((success)=>{
    res.json({success:true})
  })
})
.post("/api/newsfeedPost",(req,res,next)=>{
  var {userID,description,username} = req.body
     Newsfeed.create({userID,description,username})
     .then((success)=>{
    res.json({success:true})
  })
})
.get("/api/fetchGroups",(req,res,next)=>{
  Groups.find().populate("creatorID",{fullName:"fullName",department:"department",username:"username",university:"university"},
 ).exec().then((success) => { if(success)res.json({ success: success }) }).catch((err)=>console.log(err))
})

  //request from dashboard
  .post('/api/uploadDp', (req, res, next) => {
    var newform = new formidable.IncomingForm();

    newform.keepExtensions = true;
    newform.parse(req, (err, fields, files) => {
      
       if(files.dp.size > 1055021)
      return res.json({ error: "Image size should not be above 1mb" });
        
      cloudinary.uploader.upload(files.dp.path, function (result) {
          if (result.url) {
            let userData = jwt.decode(fields.token)
            User.findByIdAndUpdate(userData.id,  {dpUrl: result.url}).then((success) => { res.json({ dpUrl: result.url }); })
          } else {
            res.json({ error: "Error uploading to cloudinary" }); console.log("error uploading to cloudinary")
          }
      })
    })
  })

  .post('/api/groupImagePost',(req,res,next)=>{
    var newform = new formidable.IncomingForm();
    newform.keepExtensions = true;
    newform.parse(req, (err, fields, files) => {
      if (files.picture)
        cloudinary.uploader.upload(files.picture.path, function (result) {
          if (result.url) {
            let userData = jwt.decode(fields.token)
            let time = new Date();
                  Grouppost.create({groupID:fields.groupID,posts:{
                    type: "image",
                    userID: userData.id,
                    imgUrl: result.url,
                    date: time,
                    description: fields.description
                  }
                }).then((succ)=>res.json({ url: result.url, success: true }))
          } else {
            res.json({ error: "Error uploading the image" }); console.log("error uploading to cloudinary")
          }
        }); else res.json({ error: "Please choose an image to upload" });
    })
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
  .post('/api/createCommunity', (req, res, next) => {
    var newform = new formidable.IncomingForm();
    newform.keepExtensions = true;
    newform.parse(req, (err, fields, files) => {
      if (files.picture)
        cloudinary.uploader.upload(files.picture.path, function (result) {
          if (result.url) {
            let userData = jwt.decode(fields.token)
            Groups.create({title:fields.title,creatorID:userData.id,dpUrl:result.url,members:{userID:userData.id,type:"member"}
          }).then((success) => { if(success)res.json({ url: result.url, success: "created successfully" }) }).catch((err)=>console.log(err))
          } else {
            res.json({ error: "Error creating the group" }); console.log("error uploading to cloudinary")
          }
        }); else res.json({ error: "Please choose an image to upload" });
    })
  })
  .post('/api/createThread', (req, res, next) => {
    var newform = new formidable.IncomingForm();
    newform.keepExtensions = true;
    newform.parse(req, (err, fields, files) => {
      if (files.picture)
        cloudinary.uploader.upload(files.picture.path, function (result) {
          if (result.url) {
            let userData = jwt.decode(fields.token)
            Sectionpost.create({userID:userData.id,title:fields.title,description:fields.description,section:fields.section,type:"sectionpost",username:userData.username,imgUrl:result.url})
          .then((success) => { if(success)res.json({ url: result.url, success: "created successfully" }) }).catch((err)=>console.log(err))
          } else {
            res.json({ error: "Error creating the group" }); console.log("error uploading to cloudinary")
          }
        }); else res.json({ error: "Please choose an image to upload" });
    })
  })
module.exports = router;
