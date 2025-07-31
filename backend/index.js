const express = require('express');
const errorMiddleware = require('./middleware/errorMiddleware');
const connectDb = require('./config/db');
require('dotenv').config()
const cors = require('cors')
const path = require('path')


const app= express();

app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(express.json())
app.use(errorMiddleware)

app.use('/api/chat/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000



app.get('/' , (req,res)=>{
    res.status(200).json({message:'Hey this is SAURABH AGRAHARI' , success:true})
})

//user routes
app.use('/api/auth' , require('./routes/userRoutes'))

// chat routes
app.use('/api/chat' , require('./routes/chatRoutes'))




app.listen(PORT , async()=>{
    try {
        await connectDb()
        console.log(`Server is running on port ${PORT}`)
        
    } catch (error) {
        console.log(`Connection Failed !`)
        
    }
})



// 6888791338f015d3e975e64b