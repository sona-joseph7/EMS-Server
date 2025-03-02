const User = require('./models/user')
const bcrypt = require('bcrypt')
require('./database/dbConnection')


const userRegister = async()=>{
   
    try{
        const hashedPassword = await bcrypt.hash("admin",10)
         const newUser = new User({
            name:"Admin",
            email:"admin@gmail.com",
            password:hashedPassword,
            role:"admin"
         })
         await newUser.save()
    }catch(err){
        console.log(err);
        
    }
}

userRegister()