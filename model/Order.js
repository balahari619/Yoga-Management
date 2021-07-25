const mongoose = require('mongoose');


var orderSchema = new mongoose.Schema({
    _id : {
        type : mongoose.Schema.Types.ObjectId,
        auto : true
    },
    userId: {
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
}, { timestamps: true } 
)

module.exports = mongoose.model('Order', orderSchema);