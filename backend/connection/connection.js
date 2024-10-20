const mongoose = require("mongoose");


const connection = async() =>{
    try {
        await mongoose.connect(`${process.env.URL}`,{ 
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log("connected to database SUCESSFULLY");
    } catch (error) {
        console.log(error);
    }
}
connection();