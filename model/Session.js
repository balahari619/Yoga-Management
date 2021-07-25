const mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
    _id : {
        type : mongoose.Schema.Types.ObjectId,
        auto : true
    },
    scheduleId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Schedule'
    },
    completed : {
        type : Number,
        required : true
    },
    remaining : {
        type : Number,
        required : true
    }
}, { timestamps: true } 
)

module.exports = mongoose.model('Session', sessionSchema);