import mongoose from "mongoose";
const ImgSchema=new mongoose.Schema({
    img:String,
    name:String,
    content:String,
    mail:String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
})
// const Model=mongoose.model('Models',ImgSchema)
// module.exports=Model

export default mongoose.model('Model', ImgSchema);