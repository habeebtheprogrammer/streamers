var express = require('express');
var router = express.Router()
var bcrypt = require('bcrypt');
var User = require('../model/userModel');
var Newsletter = require('../model/newsletter');
var Listing = require('../model/listing')
var Region = require('../model/regions')
var Country = require('../model/country')
var City = require('../model/cities')
var moment = require('moment')
var generator = require("generate-password")
var jwt = require('jsonwebtoken');
var formidable = require('formidable');
var cloudinary = require("cloudinary")
var dotenv = require('dotenv')
var path  = require ('path')
var utils = require("./utils")
dotenv.config();

cloudinary.config({
  cloud_name: 'afrikal',
  api_key: '345824351715158',
  api_secret: '55TwfraW6ST15TGvq6tjHSF9NfA'
})
function auth(req,res,next){
  var token =req.header("authorization");
  if(token){
    var data = jwt.decode(token,"t1z2o3o4r5");
    req.userID = data.id;
    req.username = data.username
    next();
  }else res.status(404)

  
}
router.post('/api/signin', function (req, res, next) {
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
    username: username,role:"admin"
  }).then((user) => {
    if (user) {
      data.id = user._id
        data.username = username
        bcrypt.compare(password, user.password).then((valid) => {
          if (valid) {
            var token = jwt.sign(data, "t1z2o3o4r5").toString();
            res.header('x-auth', token).json({ "token": token });
          } else res.json({ "error":  "Please enter a valid username/password", "password": "incorrect password"  })
        }).catch((error) => (console.log(error)));
    } 
    else {
      res.json({ "error": "Please enter a valid username/password" })
    }
  }).catch((err)=>cres.json({ "error": "Please enter a valid username/password" }))
})
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
      data.id = user._id
        data.username = username
        bcrypt.compare(password, user.password).then((valid) => {
          if (valid) {
            var token = jwt.sign(data, "t1z2o3o4r5").toString();
            res.header('x-auth', token).json({ "token": token });
          } else res.json({ "error":  "Please enter a valid username/password", "password": "incorrect password"  })
        }).catch((error) => (console.log(error)));
    } 
    else {
      res.json({ "error": "Please enter a valid username/password" })
    }
  }).catch((err)=>console.log(err))
})

  .post("/api/createUser",auth, (req, res, next) => {
    const { username, password, email } = req.body
    User.findOne({username:username}).then((user)=>{
      if(user) return res.json({error:"This user already exists"})
      User.findOne({ email: email }).then((user) => {
        if (user) return res.json({ error:  "This email address is not available"})
        bcrypt.hash(password, 10).then((hash) => {
          User.create({
            username, password:hash, email,role:"scanner",creatorID:req.userID
          })
            .then((user) => {
              if (user) {
                res.json({success:"Account created successfully",user})
              }
            }).catch((error) => { console.log(error); res.json({ error: { "server": "An error has occured" } }); })
        })
      })
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
  router.post("/api/changeUserPassword",auth,(req,res)=>{
    const{oldPassword,newPassword,username} = req.body;
    User.findOne({username,creatorID:req.userID}).then((user)=>{
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
  User.findOneAndUpdate(req.userID,req.body).then((succ)=>{
    if(succ){
      res.json({success:"Update was successful"})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.post("/api/updateUserProfile",auth,(req,res)=>{
  User.findOneAndUpdate({creatorID:req.userID,username:req.body.username},req.body).then((succ)=>{
    if(succ){
      res.json({success:"Update was successful"})
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
router.get("/api/getAttractionById",auth,(req,res)=>{
  Listing.findById(req.query.id).populate("creatorID").exec().then((attraction)=>{
    if(attraction){
      res.json({attraction})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.get("/api/mostRecentAttraction",auth,(req,res)=>{
  Listing.find({completed:true}).sort({id:-1}).limit(4).populate("creatorID").exec().then((attractions)=>{
    if(attractions){
      res.json({attractions})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.get("/api/topSellers",auth,(req,res)=>{
  User.find({role:"merchant"}).sort({views:-1}).limit(4).then((merchants)=>{
    if(merchants){
      res.json({merchants})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.get("/api/activityLog",auth,(req,res)=>{
  var data =[]
  User.find().sort({date:-1}).limit(4).then((users)=>{
     data =data.concat(users)
     Listing.find({completed:true}).sort({date:-1}).limit(4).populate("creatorID").exec().then((attractions)=>{
      data = data.concat(attractions);
      res.json({data})

    })
  })

})
router.post("/api/deleteUser",auth,(req,res)=>{
  User.findOneAndRemove({creatorID:req.userID,username:req.body.username}).then((user)=>{
    if(user){
      res.json({success:"User deleted"})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.post("/api/deleteAttraction",auth,(req,res)=>{
  Listing.findOneAndRemove({creatorID:req.userID,_id:req.body.id}).then((attraction)=>{
    if(attraction){
      res.json({success:"Attraction deleted"})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.get("/api/getUsersByMerchant",auth,(req,res)=>{
  User.find({creatorID:req.userID}).then((users)=>{
    if(users){
      res.json({users})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
.get("/api/search", (req, res, next) => {
  var results =[]
    User.find({ $text: { $search: req.query.query }}, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).then((data) => { 
      results = results.concat(data);
      Listing.find({ $text: { $search: req.query.query }}, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).then((lists) => { 
        results = results.concat(lists);
        res.json({results})
      }).catch((err)=>console.log(err))
    }).catch((err)=>console.log(err))
})
router.get("/api/getRegions",auth,(req,res)=>{
  Region.find().then((regions)=>{
    if(regions){
      res.json({regions})
    }
  })
})
router.get("/api/getCountries",auth,(req,res)=>{
  Country.find().then((countries)=>{
    if(countries){
      res.json({countries})
    }
  })
})
router.get("/api/getCountriesByRegion",auth,(req,res)=>{
  Country.find({regionID:req.query.regionID}).then((countries)=>{
    if(countries){
      res.json({countries})
    }
  })
})
router.get("/api/getCitiesByCountry",auth,(req,res)=>{
  City.find({countryID:req.query.countryID}).then((cities)=>{
    if(cities){
      res.json({cities})
    }
  })
})
router.get("/api/getUsers",auth,(req,res)=>{
  User.find().then((users)=>{
    if(users){
      res.json({users})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.get("/api/getMerchants",auth,(req,res)=>{
  User.find({role:"merchant"}).then((merchants)=>{
    if(merchants){
      res.json({merchants})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.get("/api/getProfileById",auth,(req,res)=>{
  User.findOne({creatorID:req.userID,username:req.query.id}).then((user)=>{
    if(user){
      res.json({user})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.get("/api/getProfileByUsername",auth,(req,res)=>{
  User.findOne({username:req.query.id}).then((user)=>{
    if(user){
      res.json({user})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.get("/api/getSavedListing",auth,(req,res)=>{
  Listing.find({creatorID:req.userID,completed:false}).then((attractions)=>{
    if(attractions){
      res.json({attractions})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.get("/api/getActiveListing",auth,(req,res)=>{
  Listing.find({creatorID:req.userID,completed:true}).then((attractions)=>{
    if(attractions){
      res.json({attractions})
    }
    else res.json({error:"An error has occured. please try again later"})
  })
})
router.get("/api/getListing",auth,(req,res)=>{
  Listing.find({completed:true}).then((attractions)=>{
    if(attractions){
      res.json({attractions})
    }
    else res.json({error:"An error has occured. please try again later"})
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
router.post("/api/saveListing",auth,(req,res)=>{
  var data = {}
  data =  utils.filterData(req)
  Listing.findOneAndUpdate({"creatorID":req.userID,_id:req.body._id},data).then((succ)=>{
    if(succ){
      res.json({success:"saved"})
    }
    else {
      Listing.create({...data,creatorID:req.userID}).then((attraction)=> res.json({success:"save",attraction}))
    }
  })
})
router.post("/api/saveRegion",auth,(req,res)=>{
  title =  req.body.title
  Region.findOne({title}).then((exist)=>{
    if(exist){
      res.json({error:"This region already exist"})
    }
    else {
      Region.create({title}).then((region)=> res.json({success:"save",region}))
    }
  })
})
router.post("/api/saveCountry",auth,(req,res)=>{
  title =  req.body.title
  regionID =  req.body.regionID
  Country.findOne({title}).then((exist)=>{
    if(exist){
      res.json({error:"This country already exist"})
    }
    else {
      Country.create({title,regionID}).then((country)=> res.json({success:"save",country}))
    }
  })
})
router.post("/api/saveCity",auth,(req,res)=>{
  title =  req.body.title
  countryID =  req.body.countryID
  City.findOne({title}).then((exist)=>{
    if(exist){
      res.json({error:"This city already exist"})
    }
    else {
      City.create({title,countryID}).then((city)=> res.json({success:"save",city}))
    }
  })
})
router.post("/api/uploadListing",auth,(req,res)=>{
  var data = {}
  data = utils.filterData(req)
  if(utils.completed(data)){
    data.completed = true
    Listing.findOneAndUpdate({"creatorID":req.userID,_id:req.body._id},{...data,date:new Date()}).then((succ)=>{
      if(succ){
        res.json({success:"saved"})
      }
      else {
        Listing.create({...data,creatorID:req.userID}).then((succ)=> res.json({success:"save"}))
      }
    })
  }else res.json({error:"Please complete the attraction"})
 
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
