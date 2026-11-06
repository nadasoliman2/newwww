import { userModel } from "../../DB/models/user.model.js"
import { messageModel} from "../../DB/models/message.model.js"
import { requestsModel} from "../../DB/models/request.model.js"
import { AwsClient } from "google-auth-library"
import { BadException,ConflictException ,NotfoundException} from "../../common/exception/error.exception.js"

export const sendMessage = async(MessageData,senderId,receiverId)=>{
  
    //check receiverId is vaild user
    const reciever = await userModel.findById(receiverId)
    if(!reciever){
    NotfoundException("receiver not found")
    }
    //check sender === receiver
    if(senderId.toString() === receiverId.toString()){
  return ConflictException("you can't send message to ypurself")
    }

    //check message content
    if(!MessageData){
  BadException("message content is required")
    }
    const message = await messageModel.create({
        senderId,
        receiverId,
        content:MessageData
    })
    return{
        message:"message sent successfully"
    }


}
export const getmessages =async(recieverId)=>{
    const reciever = await userModel.findById(recieverId)
    if(!reciever){
        throw new Error ("receiver not found",{cause:404})
    }
const messages = await messageModel.find({ receiverId: recieverId }).populate('senderId',"firstName lastName");
if (messages.length === 0){
        throw new Error ("you dont have any messages",{cause:404})

 
}
return messages.map((data) => {
    const result = {
        msg: data.content,
        time: data.createdAt,
        msg_id: data._id
    };

    if (data.anonymous === false) {
        result.sender = data.senderId;
    }

 result;
});



}


export const create_request = async (msgId, receiverId) => {

    const reciever = await userModel.findById(receiverId)
    if(!reciever)
    {
        throw new Error("reciever not found",{cause:404})
    }
    const Message = await messageModel.findOne({
        _id:msgId,
    receiverId});
console.log({Message})
    if (!Message) {
        throw new Error("message not found");
    }

    const reqExist = await requestsModel.findOne({
        messageId:msgId,
        senderId:Message.senderId
    })
    console.log("reqExist:", reqExist);
console.log("anonymous:", Message.anonymous);
console.log("condition:", !reqExist && Message.anonymous);
 if (!reqExist && Message.anonymous) {
   
    const request = await requestsModel.create({
        messageId: msgId,
        receiverId,
        senderId: Message.senderId,
        status: "pending"
    });

    return request;

}
    if(reqExist && reqExist.status === "pending"){
        return {
            meesage:"request still pending"
        }
    }
  
};


export const getmyrequests= async(senderId)=>{
    console.log(senderId)
const myrequests = await requestsModel.find( {senderId }).populate("messageId","content").populate('receiverId','firstName lastName')
    console.log(myrequests)
    if(myrequests.length===0){
        throw new Error('you donot have any requests',{cause:404})
    }
    return myrequests
}
export const changeStatus = async (requestId, status, userId) => {
    const request = await requestsModel.findById(requestId);

    if (!request) {
        throw new Error("request not found");
    }


    if ("accepted" == status) {
  await messageModel.findByIdAndUpdate(request.messageId,{anonymous:false})
  await requestsModel.findByIdAndDelete({_id:requestId})
  return {
    message:"request accepted successfully"
  }
    }
  await requestsModel.findByIdAndDelete({_id:requestId})
  return {
    message:"request rejected successfully"
  }
 
};