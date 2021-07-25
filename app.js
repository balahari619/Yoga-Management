const express     = require('express');
const dotenv      = require('dotenv');
const morgan      = require('morgan');
const bodyParser  = require("express");
const path        = require('path');

const authRoutes  = require('./Routes/authRoute');
const userRoutes   = require('./Routes/userRoute');
const adminRoutes  = require('./Routes/adminRoute');


const app = express();

const connectDB = require('./connection');

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

// LOG REQUESTS
app.use(morgan('tiny'));

// MONGODB CONNECTION
connectDB();


// ROUTES MIDDLEWARE
app.use(express.json());

app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/users', userRoutes)

app.use(bodyParser.urlencoded({ extended : true}));


app.listen(PORT, ()=> { 
    console.log(`Server is running on http://localhost:${PORT}`);
});
