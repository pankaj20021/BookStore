const mongoose = require('mongoose');
// const { schema } = require('./user');

const order = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "books",
    },
    status:{
        type:String,
        default:"order placed",
        enum: ["order placed", "out for delivery, deliverd, canceled"]
        
    },

},
{timestamps:true}
);
module.exports = mongoose.model("order",order);