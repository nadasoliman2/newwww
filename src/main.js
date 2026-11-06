import express from "express"
import {authController} from './modules/auth/index.js'
import { productController } from "./modules/product/index.js"
import { errorHandler } from "./middleware/err.middleware.js"
import { PORT } from "./config.js"
import {connectDB} from './DB/connection.js'
import { userController } from "./modules/users/index.js"
import {messageController} from './modules/messages/index.js'
const app = express() 
const port =PORT
// console.log({ cloud_name,api_key,api_secret } );

await connectDB(app, port)

// app.use(cors({
// 	origin:true,
// 	credentials:true,
// 	allowedHeaders:['Content-Type',"Authorization"]
// }))
// app.use('/uploads',express.static("uploads"))

// localhost:3000/uploads
// localhost:3000/auth
app.use(express.json())
app.use('/uploads',express.static("uploads"))

app.use('/auth',authController)
app.use('/user',userController)
app.use('/message',messageController)
app.use('/product',productController)


app.use(errorHandler)
