const mongoose = require('mongoose');

var scheduleSchema = new mongoose.Schema({
    _id : {
        type : mongoose.Schema.Types.ObjectId,
        auto : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    courseId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Course'
    },
    trainerId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Trainer'
    },
    slot : {
        type : Number,
        enum : [6, 7, 8, 9, 10, 4, 5],
        required : true
    }
}, { timestamps: true } 
)

module.exports = mongoose.model('Schedule', scheduleSchema);