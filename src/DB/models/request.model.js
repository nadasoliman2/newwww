import mongoose from "mongoose";

//status 
//messageId
//senderId
//reciever
const requestSchema = new mongoose.Schema(
    {
messageId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Message",
    required:true
},
senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
receiverId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
status:{
    type:String,
    enum:["pending","accepted","rejected"],
    default:"pending",
    required:true
}
    },{
        timestamps:true
    }
)
export  const requestsModel = mongoose.model("Request",requestSchema)

