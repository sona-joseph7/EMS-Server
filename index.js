
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/router')
require('./database/dbConnection')

const authRoutes = require('./routes/authRoutes');  //login auth


const emsServer = express()

emsServer.use(cors())
emsServer.use(express.json())
emsServer.use(router)
emsServer.use('/uploads',express.static('./uploads'))

emsServer.use('/auth', authRoutes);  //login auth


const PORT = process.env.PORT || 3000

emsServer.listen(PORT, ()=>{
    console.log("Server is running Successfully");
})

emsServer.get('/',(req,res)=>{
    res.status(200).send('<h1>Serving Running Successfully....!!!</h1>')
})

emsServer.post('/',(req,res)=>{
    res.status(200).send("POST REQUEST")
})