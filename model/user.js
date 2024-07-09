const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
    name:{ type:String,
        required:[true,'Please provide user Id']
    },
    age:{ type:Number,
        required:[true,'Please provide age']
    },
    phone:{ type:Number,
        required:[true,'Please provide phone number']
    },
    email:{ type:String,
        required:[true,'Please provide user email']
    },
    password:{ type:String,
        required:[true,'Please provide user password']
    },
    
},{
    timestamps:true
});

const User= mongoose.model("User",UserSchema);
module.exports=User;