const { json } = require('express');
const mongoose = require('mongoose');
const Trainer     = require('./Trainer');

var courseSchema = new mongoose.Schema({
    _id : {
        type : mongoose.Schema.Types.ObjectId,
        auto : true
    },
    name : {
        type : String,
        required : true
    },
    trainerIds : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'Trainer'
    },
    price : {
        type : Number,
        required : true
    },
    noOfSessions : {
        type : Number,
        required : true
    }
}, { timestamps: true } 
)

module.exports = mongoose.model('Course', courseSchema);