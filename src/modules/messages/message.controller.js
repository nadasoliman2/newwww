import { Router } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import {sendMessage,getmessages,create_request,getmyrequests,changeStatus} from "./message.service.js"
const router = Router()
 //send message


router.get('/All',authentication,async (req,res,next)=>{

const reciever= req.user._id


const result = await getmessages(reciever)
return res.status(200).json(result)

})
router.post('/send/:recieveId',authentication,async (req,res,next)=>{

const senderId = req.user._id
const {recieveId} = req.params
const {message} = req.body
console.log({message,senderId ,recieveId})
const result = await sendMessage(message,senderId ,recieveId)
return res.status(200).json(result)

})
router.get('/requests',authentication,async(req,res,next)=>{
const  result =  await  getmyrequests(req.user._id)
return res.json(result)
})
router.post ('/request/:msgId',authentication,async(req,res,next)=>{
//senderId 
//reciever - create requset
//messageid in params
const {msgId} = req.params
const recieverId = req.user._id
console.log({msgId,recieverId})
const  result =  await  create_request(msgId,recieverId)
return res.json(result)
})

router.patch('/requests/:requstId',authentication,async(req,res,next)=>{

const {requstId} = req.params
console.log(requstId)
const  result =  await  changeStatus(requstId,req.body.status,req.user._id)
return res.json(result)
})
//recieve message // check


export default router