const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"User name must be provided"],
  },
  passwordHash:{
     type:String,
    required:[true,"Password must be provided"],
  },
  role:{
     type:String,
     enum:["student","canteen_staff","admin"],
    required:[true,"Role must be specified"],
  },
  phoneNumber:{
      type:String,
      required:[true,"Phone number must be provided"],
  },
    canteenId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Canteen",
      required:function(){
        return this.role==="canteen_staff";
      },
     
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },

   
});
module.exports=mongoose.model("User",userSchema);