const mongoose = require('mongoose')

const connectDb = async()=>{
    try {

        const connection = mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DATABASE}`)
        console.log(`Database connected successfully !`)
        
    } catch (error) {
        console.log(`Databse not connected !`)
        process.exit(1)
        
    }
}

module.exports = connectDb