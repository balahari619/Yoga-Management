const mongoose = require('mongoose');

var trainerSchema = new mongoose.Schema({
    _id : {
        type : mongoose.Schema.Types.ObjectId,
        auto : true
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    contact : {
        type : Number,
        required : true
    },
    slot : {
        type : Number,
        enum : [6, 7, 8, 9, 10, 4, 5],
        required : true
    },
    isAllocated : {
        type : Boolean,
        default : false
    }
}, { timestamps: true } 
)

module.exports = mongoose.model('Trainer', trainerSchema);