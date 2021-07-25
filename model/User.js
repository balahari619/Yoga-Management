const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
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
        default : "user"
    },
}, { timestamps: true } 
)
// userSchema.path('email').validate(async (email)=>{
//     const emailCount = await mongoose.models.users.countDocuments({email})
//     return !emailCount
//   }, 'Email already exists')
// userSchema.path('contact').validate(async (contact)=>{
//     const contactCount = await mongoose.models.users.countDocuments({contact})
//     return !contactCount
//   }, 'Contact already exist')
// userSchema.path('password').validate(async (password)=>{
//     const passwordCount = await mongoose.models.users.countDocuments({password})
//     return !passwordCount
//   }, 'Member with same ID already exist')
module.exports = mongoose.model('User', userSchema);

// const mongoose = require("mongoose")

// const teamschema = new mongoose.Schema({
//   Memberid: { type: String, ref : 'group' },
//   name: { type: String, required : true },
//   email: { type: String, required : true},
//   phoneNumber: { type: mongoose.Mixed, required : true },
//   password : {type : String, required : true},
//   // teamId : { type: Number, required : true},
//   gender : {type : String, enum: ["Male", "Female"]},
//   role: {type: String, enum : ["Leader", "Member"]},
//   created_at: { type: Date, default: new Date().toISOString() },
//   updated_at: { type: Date, default: new Date().toISOString() },
// }, { capped: false });
// teamschema.path('email').validate(async (email)=>{
//   const emailCount = await mongoose.models.team_members.countDocuments({email})
//   return !emailCount
// }, 'Email already exist')
// teamschema.path('phoneNumber').validate(async (phoneNumber)=>{
//   const PhoneNumberCount = await mongoose.models.team_members.countDocuments({phoneNumber})
//   return !PhoneNumberCount
// }, 'PhoneNumber already exist')
// teamschema.path('Memberid').validate(async (Memberid)=>{
//   const MemberidCount = await mongoose.models.team_members.countDocuments({Memberid})
//   return !MemberidCount
// }, 'Member with same ID already exist')
// module.exports = mongoose.model("team_members", teamschema)