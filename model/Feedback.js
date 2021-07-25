const mongoose = require('mongoose');

var feedbackSchema = new mongoose.Schema({
    _id : {
        type : mongoose.Schema.Types.ObjectId,
        auto : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId
    },
    scheduleId: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Schedule'
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
    response  : {
        type : String,
        required : true
    },
    completed : {
        type : mongoose.Mixed,
        default : 1
    },
}, { timestamps: true } 
)

module.exports = mongoose.model('Feedback', feedbackSchema);