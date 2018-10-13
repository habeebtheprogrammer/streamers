var mongoose = require('../config/mongoose');

var eventSchema = mongoose.Schema({
    userID: String,
    title: {
        type: String
    },
    location: {
        type: String
    },
      address: {
        type: String
    },
    description: {
        type: String
    },
    checkedDate:{
        type:String
    },
    customDate:{
        type:String
    },
    date:{
        type: String
    },
    imgUrl:{
        type:String
    },
    imgID: String,
    industry: {
        type: String
    },
    startTime: {
        type: String
    },
    stopTime: {
        type: String
    },
    ticket:{
        type:String
    },
    views:{
        type: Number,
        default: 0
    }
});
eventSchema.index({ title: 'text', industry: 'text',location:'text' });

var Event = mongoose.model('event', eventSchema);
module.exports = Event;

