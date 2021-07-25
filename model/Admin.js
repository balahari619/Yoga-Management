const mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
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
    password : {
        type : String,
        required : true
    },
    contact : {
        type : mongoose.Mixed,
        required : true
    },
    role : {
        type : String,
        default : "admin"
    },
}, { timestamps: true } 
)
module.exports = mongoose.model('Admin', adminSchema);