require('dotenv').config()
const cookieParser = require('cookie-parser')
const express = require('express')
const mongoose = require('mongoose')
const taskRoutes = require('./routes/tasks')
const userRoutes = require('./routes/users')
const projectRoutes = require('./routes/projects')
const authenticationMiddleware = require('./middlewares/authMiddleware');

const cors = require('cors');
const port = process.env.PORT || 8000;


//express app

const app = express()
app.use(cors());
//middleware
// app.use(authenticationMiddleware.authenticateUser);


app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
app.use(cookieParser())
//routes



app.use('/api/tasks',taskRoutes)
app.use('/api/users',userRoutes)
app.use('/api/projects',projectRoutes)

//connect to database
mongoose.connect(process.env.MONGODB_URI)
.then(() =>{
    // listen for requests
    app.listen(port, () => {
        console.log(`connected to db & listening on port ${port}`)
    })

})
.catch((error) => {
    console.log(error)
})



