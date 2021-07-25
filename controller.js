const Course = require('./model/Course');
const Feedback = require('./model/Feedback');
const Order = require('./model/Order');
const Schedule = require('./model/Schedule');
const Session = require('./model/Session');
const Trainer = require('./model/Trainer');
const User      = require('./model/User');
const Admin = require('./model/Admin')

const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const dotenv      = require('dotenv');
const { db } = require('./model/Trainer');
const objectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');

// USER FUNCTIONALITY
//====================

// USER REGISTRATION
const userRegister = (req, res, next) => {
    const {name , email, password, contact } = req.body
    if (!name) {
        return res.status(400).json({message : "name required"})
    }
    if (!email) {
        return res.status(400).json({message : "email required"})
    }
    if (!password) {
        return res.status(400).json({message : "password required"})
    }
    if (!contact) {
        return res.status(400).json({message : "contact required"})
    }
    bcrypt.hash(req.body.password, 10, async function(error, hashedPass) {
        if(error) {
            res.status(400).json({
                error : error.message
            })
        }
        const doesExist = await User.findOne({email : email})
        if (doesExist) {
            return res.status(400).json({error : "email already registered"})
        }
        const Exist = await User.findOne({contact : contact})
        if (Exist) {
            return res.status(400).json({error : "contact already registered"})
        }
        let user = new User ({
            name : req.body.name,
            email : req.body.email,
            password : hashedPass,
            contact : req.body.contact,
            role : req.body.role
        })
        user.save()
        .then(user => {
            res.status(200).json({
                message : "User added Successfully"
            })
        })
        .catch(error => {
            res.status(400).json({
                error : error.message
            })
        })
    })
}


// USER LOGIN
const userLogin = (req, res, next) => {
    var username = req.body.username
    var password = req.body.password
    User.findOne({ $or: [{ email: username }, { contact: username }] })
    .then(user => {
        if (user) {
        bcrypt.compare(password, user.password, function (error, result) {
            if (error) {
              res.status(400).json({
                error: error.message
              })
            }
            if (result) {
              let token = jwt.sign({ _id : user._id,  name : user.name, role : user.role}, process.env.PRIVATE_KEY, { expiresIn: '2hr' })
              res.status(200).json({
                message: 'User Logged-in Sucessfully',
                token
              })
            } else {
              res.status(400).json({
                message: 'Password incorrect!'
              })
            }
          })
        } else {
          res.status(400).json({
            message: 'No User Found!'
          })
        }
    })
    .catch(error => {
        res.status(400).json({
            error : error.message
        })
    })
}


// USER PROFILE
async function userProfile(req, res) {
    const decoded = jwt.decode(req.headers.authorization.split(' ')[1], process.env.PRIVATE_KEY)
    const id = decoded._id;
        User.findById(id)
        .select('name email contact -_id')
        .then(result => {
            res.status(200).json({
                userProfile : result
            });
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({
                error : error.message
            })
        });
}


// ALL COURSES LIST
async function allCourses (req, res) {
    Course.aggregate([
      {
        $lookup : {
          from : "trainers",
          localField : "trainerIds",
          foreignField : "_id",
          as : "TrainerDetails"
        }
      },{
        $project : {
          name : 1,
          price : 1,
          noOfSessions : 1,
          TrainerDetails : {
            name : 1,
            email : 1,
            contact : 1,
            slot : 1
          }
          }
        }
    ]).exec((err, result) => {
      if (err) {
        res.status(400).json({
            err : err.message
        })
      }
      if (result) {
        res.status(200).json({
          courses : result
        })
      }
    })
}


// SINGLE COURSE DETAILS
async function singleCourse(req, res) {
    const id = req.query.id;
    try {
        const course = await Course
            .findById(id)
            .populate('trainerIds', 'name email contact slot -_id')
            .select('name price noOfSessions CourseIds trainerIds -_id')
        res.status(200).json(course)
    } catch (err) {
        res.status(404).json({
            err : "Course not found"
        })
    }
}


// ORDER BOOKING
async function orderBooking(req, res) {
    const decoded = jwt.decode(req.headers.authorization.split(' ')[1], process.env.PRIVATE_KEY)
    const id = decoded._id;
    const { courseId, trainerId} = req.body
    if (!courseId) {
        return res.status(400).json({message : "courseId required"})
    }
    if (!trainerId) {
        return res.status(400).json({message : "trainerId required"})
    }
    let order = new Order ({
        userId : id,
        courseId : req.body.courseId,
        trainerId : req.body.trainerId
    })
    order.save()
    .then(order => {
        res.status(200).json({
            message : "Order Booked Successfully"
        })
    })
    .catch(error => {
        res.status(400).json({
            error : error.message
        })
    })
}


// USER COURSES
async function userCourses(req, res) {
    const decoded = jwt.decode(req.headers.authorization.split(' ')[1], process.env.PRIVATE_KEY)
    const id = decoded._id;
    const courseuser = await Order.findOne({userId : mongoose.Types.ObjectId(id)})
    if (courseuser) {
        Order.aggregate([
            {
                $lookup : {
                    from : "courses",
                    localField : "courseId",
                    foreignField : "_id",
                    as : "CourseDetails"
                    }
            },{
                $lookup : {
                    from: "trainers",
                    localField : "trainerId",
                    foreignField : "_id",
                    as : "TrainerDetails"
                    }
            },{ 
                $match : { 
                    "userId" : mongoose.Types.ObjectId(id)
                } 
            },{
                $project : {
                CourseDetails : {
                    name :1,
                    price : 1,
                    noOfSessions : 1
                },
                TrainerDetails : {
                    name : 1,
                    email : 1,
                    contact : 1,
                    slot : 1
                }
                }
            }
        ]).exec((err, result) => {
            if (err) {
                res.status(400).json({
                    err : err.message
                })
            }
            if (result) {
                res.status(200).json({
                    Courses : result
                })
            }
        })
    }
    else {
        res.status(400).json({
            err : "No Courses for you"
        })
    }

}


// USER SCHEDULE
async function userSchedule(req, res) {
    const decoded = jwt.decode(req.headers.authorization.split(' ')[1], process.env.PRIVATE_KEY)
    const id = decoded._id;
    const scheduleuser = await Schedule.findOne({userId : mongoose.Types.ObjectId(id)})
    if (scheduleuser) {
        Schedule.aggregate([
            {
                $lookup : {
                    from : "courses",
                    localField : "courseId",
                    foreignField : "_id",
                    as : "CourseDetails"
                    }
            },{
                $lookup : {
                    from: "trainers",
                    localField : "trainerId",
                    foreignField : "_id",
                    as : "TrainerDetails"
                    }
            },{ 
                $match : { 
                    "userId" : mongoose.Types.ObjectId(id)
                } 
            },{
                $project : {
                CourseDetails : {
                    name :1,
                    price : 1,
                    noOfSessions : 1
                },
                TrainerDetails : {
                    name : 1,
                    email : 1,
                    contact : 1,
                    slot : 1
                }
                }
            }
        ]).exec((err, result) => {
            if (err) {
                res.status(400).json({
                    err : err.message
                })
            }
            if (result) {
                res.status(200).json({
                Schedule : result
                })
            }
        })
    }  
    else {
        res.status(400).json({
            err : "No schedule fixed for you"
        })
    }

}


// USER FEEDBACK
async function feedback(req, res) {
    const decoded = jwt.decode(req.headers.authorization.split(' ')[1], process.env.PRIVATE_KEY)
    const id = decoded._id;
    const { scheduleId, courseId, trainerId, response } = req.body
    if (!scheduleId) {
        return res.status(400).json({message : "scheduleId required"})
    }
    if (!courseId) {
        return res.status(400).json({message : "courseId required"})
    }
    if (!trainerId) {
        return res.status(400).json({message : "trainerId required"})
    }
    if (!response) {
        return res.status(400).json({message : "response required"})
    }
    const scheduledFeedback = await Schedule.findOne({_id : mongoose.Types.ObjectId(scheduleId)})
    if (scheduledFeedback)
    {
        let feedback = new Feedback ({
            userId : id,
            scheduleId : req.body.scheduleId,
            courseId : req.body.courseId,
            trainerId : req.body.trainerId,
            response : req.body.response
        })
        let count = await Feedback.findOne({userId : mongoose.Types.ObjectId(id)}).countDocuments()
        let sessions = await Course.findOne({_id : mongoose.Types.ObjectId(courseId)})
        let sessionsTotal = sessions.noOfSessions
        if(count >= parseInt(sessionsTotal)) {
        var updateData = {
            isAllocated : false
        }
        db.collection('trainers').updateOne({ _id: mongoose.Types.ObjectId(trainerId) }, { $set: updateData }, function (err, result) {
        console.log('Availability Updated');
        res.status(400).json({
            err : "Feedback for all sessions are posted"
        })
        })
        }
        else { 
        feedback.completed = count + 1;
        feedback.save()
        .then(feedback => {
            res.status(200).json({
                message : "Feedback posted successfully"
            })
        })
        .catch(error => {
        res.status(400).json({
            error : error.message
            })
        })
    } }
    else ( 
        res.status(400).json({
            error : "Cannot post feedback for a unscheduled course"
        })
    )
}


// USER SESSIONS
async function session(req, res) {
    const id = req.query.id;
    Schedule.aggregate([
        {
            $lookup : {
              from : "courses",
              localField : "courseId",
              foreignField : "_id",
              as : "sessionDetails"
            }
        },{
          $lookup : {
            from : "feedback",
            localField : "_id",
            foreignField : "scheduleId",
            as : "completed"
          }
        },{
            $match :  {
                "_id" : mongoose.Types.ObjectId(id)
            }
        }
        // ,{
        //     $unwind : "$sessionDetails"
        // },{
        //     $unwind : "$sessionDetails.noOfSessions"
        // },{
        //     $unwind : "$completed"
        // },{
        //     $unwind : "$completed.completed"
        // }
        ,{
          $project : {
            sessionDetails : {
                noOfSessions : 1
            },
            completed : {
                $max : "$completed.completed"
            },
            remaining : {
                $subtract : [ "$sessionDetails.noOfSessions", "$completed.completed" ]
            }
            }
        }
      ]).exec((err, result) => {
        if (err) {
          res.status(400).json({
              err : err.message
          })
        }
        if (result) {
          res.status(200).json({
            session : result
          })
        }
    })
}


// ADMIN FUNCTIONALITY
//====================

// ADMIN REGISTRATION
const adminRegister = (req, res, next) => {
    const {name , email, password, contact } = req.body
    if (!name || !email || !password || !contact) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    if (!name) {
        return res.status(400).json({message : "name required"})
    }
    if (!email) {
        return res.status(400).json({message : "email required"})
    }
    if (!password) {
        return res.status(400).json({message : "password required"})
    }
    if (!contact) {
        return res.status(400).json({message : "contact required"})
    }
    bcrypt.hash(req.body.password, 10, async function(error, hashedPass) {
        if(error) {
            res.status(400).json({
                error : error.message
            })
        }
        const doesExist = await User.findOne({email : email})
        if (doesExist) {
            return res.status(400).json({error : "email already registered"})
        }
        const Exist = await User.findOne({contact : contact})
        if (Exist) {
            return res.status(400).json({error : "contact already registered"})
        }
        let admin = new Admin ({
            name : req.body.name,
            email : req.body.email,
            password : hashedPass,
            contact : req.body.contact,
            role : req.body.role
        })
        admin.save()
        .then(admin => {
            res.status(200).json({
                message : "Admin added Successfully"
            })
        })
        .catch(error => {
            res.status(400).json({
                error : error.message
            })
        })
    })
}


// ADMIN LOGIN
const adminLogin = (req, res, next) => {
    var username = req.body.username
    var password = req.body.password
    Admin.findOne({ $or: [{ email: username }, { contact: username }] })
    .then(admin => {
        if (admin) {
            bcrypt.compare(password, admin.password, function (error, result) {
            if (error) {
                res.status(400).json({
                error: error.message
                })
            }
            if (result) {
                let token = jwt.sign({ _id: admin._id, name: admin.name, role : admin.role }, process.env.PRIVATE_KEY , { expiresIn: '2hr' })
                res.status(200).json({
                message: 'Admin Logged-in Sucessfully',
                token
                })
            } else {
                res.status(400).json({
                message: 'Password incorrect!'
                })
            }
            })
        } else {
            res.status(400).json({
            message: 'No Admin Found!'
            })
        }
    })
    .catch(error => {
        res.status(400).json({
            error : error.message
        })
    })
}


// ADD NEW COURSE
async function addCourse (req, res, next) {
    const {name , trainerIds, price, noOfSessions } = req.body
    if (!name) {
        return res.status(400).json({message : "name required"})
    }
    if (!trainerIds) {
        return res.status(400).json({message : "trainerIds required"})
    }
    if (!price) {
        return res.status(400).json({message : "price required"})
    }
    if (!noOfSessions) {
        return res.status(400).json({message : "noOfSessions required"})
    }
    const doesExist = await Course.findOne({name : name})
    if (doesExist) {
        return res.status(400).json({error : "Course already exists"})
    }
    let course = new Course ({
        name : req.body.name,
        trainerIds : req.body.trainerIds,
        price : req.body.price,
        noOfSessions : req.body.noOfSessions
    })
    course.save()
    .then(course => {
        res.status(200).json({
            message : "Course added Successfully"
        })
    })
    .catch(error => {
        res.status(400).json({
            error : error.message
        })
    })
}


// ADD NEW TRAINER
async function addTrainer (req, res, next) {
    const {name , email, contact, slot } = req.body
    if (!name) {
        return res.status(400).json({message : "name required"})
    }
    if (!email) {
        return res.status(400).json({message : "email required"})
    }
    if (!contact) {
        return res.status(400).json({message : "contact required"})
    }
    if (!slot) {
        return res.status(400).json({message : "slot required"})
    }
    const doesExist = await Trainer.findOne({name : name})
    if (doesExist) {
        return res.status(400).json({error : "Trainer already exists"})
    }
    let trainer = new Trainer ({
        name : req.body.name,
        email : req.body.email,
        contact : req.body.contact,
        slot : req.body.slot
    })
    trainer.save()
    .then(trainer => {
        res.status(200).json({
            message : "Trainer added Successfully"
        })
    })
    .catch(error => {
        res.status(400).json({
            error : error.message
        })
    })
}


// ALL TRAINERS LIST
async function allTrainers(req, res) {
    Trainer.find()
        .then(result => {   
            res.status(200).json({
                trainers: result
            });
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({
                error : error.message
            })
        });
}


// SINGLE TRAINER
async function singleTrainer(req, res) {
    const id = req.query.id;
    const trainers = await Trainer.findOne({_id : mongoose.Types.ObjectId(id)})
    if (trainers)
    {
        Trainer.findById(id)
        .then(result => {   
            res.status(200).json({
                trainer: result
            });
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({
                error : error.message
            })
        });
    }
    else {
        res.status(400).json({
            err : "Trainer not found"
        })
    }
}


// ADMIN SCHEDULE COURSES
async function courseAssignment(req, res) {
    const { userId, courseId, trainerId, slot } = req.body
    if (!userId) {
        return res.status(400).json({message : "userId required"})
    }
    if (!courseId) {
        return res.status(400).json({message : "courseId required"})
    }
    if (!trainerId) {
        return res.status(400).json({message : "trainerId required"})
    }
    if (!slot) {
        return res.status(400).json({message : "slot required"})
    }
    const trainerAvailability = await Trainer.findOne({_id : mongoose.Types.ObjectId(trainerId)})
    if(!trainerAvailability.isAllocated) 
    {
        var updateData = {
        isAllocated : true
        };
        db.collection('trainers').updateOne({"_id" : objectId(trainerId)}, { $set : updateData}, function (err, result){
            console.log("Data updated successfully")
        })
        let schedule = new Schedule ({
            userId : req.body.userId,
            courseId : req.body.courseId,
            trainerId : req.body.trainerId,
            slot : req.body.slot
        })
        schedule.save()
        .then(schedule => {
            res.status(200).json({
                message : "Schedule Booked Successfully"
            })
        })
        .catch(error => {
            res.status(400).json({
                error : error.message
            })
        })
    } else {
            res.status(400).json({
            error : "Trainer is already busy cannot schedule right now"
        })
    }
}


// ALL ORDERS
async function allOrders (req, res) {
    Order.aggregate([
        {
            $lookup : {
                from : "users",
                localField : "userId",
                foreignField : "_id",
                as : "UserDetails"
            }
        },
        {
            $lookup : {
                from : "courses",
                localField : "courseId",
                foreignField : "_id",
                as : "CourseDetails"
                }
        },{
            $lookup : {
                from: "trainers",
                localField : "trainerId",
                foreignField : "_id",
                as : "TrainerDetails"
                }
        },{
            $project : {
                _id : 1,
            UserDetails : {
                _id : 1,
                name : 1,
                email : 1,
                contact :1
            },
            CourseDetails : {
                _id : 1,
                name :1,
                price : 1,
                noOfSessions : 1
            },
            TrainerDetails : {
                _id : 1,
                name : 1,
                email : 1,
                contact : 1,
                slot : 1
            }
            }
            }
    ]).exec((err, result) => {
      if (err) {
        res.status(400).json({
            err : err.message
        });
      }
      if (result) {
        res.status(200).json({
          Orders : result
        })
      }
    })
}


// Single Order
async function singleOrder (req, res) {
    const id = req.query.id;
    const ordersingle = await Order.findOne({_id : mongoose.Types.ObjectId(id)})
    if (ordersingle) {
        Order.aggregate([
            {
                $lookup : {
                    from : "users",
                    localField : "userId",
                    foreignField : "_id",
                    as : "UserDetails"
                }
            },
            {
                $lookup : {
                    from : "courses",
                    localField : "courseId",
                    foreignField : "_id",
                    as : "CourseDetails"
                    }
            },{
                $lookup : {
                    from: "trainers",
                    localField : "trainerId",
                    foreignField : "_id",
                    as : "TrainerDetails"
                    }
            },{ 
                $match : { 
                    "_id" : mongoose.Types.ObjectId(id)
                } 
            },{
                $project : {
                    _id : 1,
                UserDetails : {
                    _id : 1,
                    name : 1,
                    email : 1,
                    contact :1
                },
                CourseDetails : {
                    _id : 1,
                    name :1,
                    price : 1,
                    noOfSessions : 1
                },
                TrainerDetails : {
                    _id : 1,
                    name : 1,
                    email : 1,
                    contact : 1,
                    slot : 1
                }
                }
                }
        ]).exec((err, result) => {
          if (err) {
            res.status(400).json({
                err : err.message
            })
          }
          if (result) {
            res.status(200).json({
              Order : result
            })
          }
        })
    }
    else {
        res.status(400).json({
            err : "Order not found"
        })
    }
}


module.exports = {
    userRegister, 
    userLogin, 
    userProfile, 
    allCourses,
    singleCourse,
    orderBooking,
    userCourses,
    userSchedule,
    feedback, 
    session,
    adminRegister,
    adminLogin,
    addCourse,
    addTrainer,
    allTrainers,
    singleTrainer,
    courseAssignment,
    allOrders, 
    singleOrder
}