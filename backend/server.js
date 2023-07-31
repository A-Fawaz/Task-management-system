require('dotenv').config()
const cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const taskRoutes = require('./routes/tasks')
const userRoutes = require('./routes/users')
const projectRoutes = require('./routes/projects')
const projectmemberRoutes = require('./routes/projectmember')



//express app
const app = express()
// Enable CORS for all routes (you can also restrict it to specific routes if needed)
app.use(cors());
//middleware
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
app.use('/api/projectmembers',projectmemberRoutes)

//connect to database
mongoose.connect(process.env.MONGODB_URI)
.then(() =>{
    // listen for requests
    app.listen(process.env.PORT, () => {
        console.log('connected to db & listening on port', process.env.PORT)
    })

})
.catch((error) => {
    console.log(error)
})



