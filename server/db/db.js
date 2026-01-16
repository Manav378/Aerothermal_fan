import mongoose from "mongoose";

const connDb = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("The database is connected succesfully" , conn.connection.host)
    } catch (error) {
        console.log("The error in database connection" , error.message)
        process.exit(1);
    }
}

export default connDb