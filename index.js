require('dotenv').config()
const express = require('express')
const connection = require('./config/db')
const userRouter = require('./routes/user.route')
const blogRouter = require('./routes/blog.route')
const cors = require('cors')
const app = express()
app.use(express.json())

app.use(cors({
    origin: process.env.CLIENT_URL,  // Allow requests from your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

const PORT = process.env.PORT


app.get('/', (req, res) => {
    res.send("Health OK")
})


app.use('/user' , userRouter)
app.use('/blog' , blogRouter)

app.listen(PORT, async () => {
    try {
        await connection
        console.log("Connected to Database")
    } catch (error) {
        console.log(error)
    }
    console.log(`Server is listen on ${PORT}`)
})