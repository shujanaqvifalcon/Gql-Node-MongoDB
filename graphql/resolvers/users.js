const Users = require('../../models/Users');
const {ApolloError}=require("apollo-server-errors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const tokenSecret = process.env.JWT_SECRET;
module.exports = {
    Mutation: {
        //Register User Mutation
        async registerUser(_, {RegisterInput: {email, password,number,name} }) {
            //worst case if user don't send all values in payload
            if(!email || !password || !number || !name){
                throw new ApolloError('All Fields are required') //throw Error :)
            }
            const existingUser = await Users.findOne({ email }); // Finding already existing user
            if (existingUser) { //if user already exist
              throw new ApolloError('User already exists '+email,'USER_ALREADY_EXISTS ') // throw error using apollo Error
            }
            const encrpytedPassword = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
            //Creating user Instance assign the updated values
            const newUser=new Users({
                name:name,
                number:number,
                email:email.toLowerCase(),
                password:encrpytedPassword
            })
            //storing user
            const res=await newUser.save();
           //BOM :) WILL RETURN EXPECTED USER
            return {...res._doc};  
        },
        async loginUser(_, {loginInput: {email, password} }) {
            //login Mutation
            //worst case if user don't send all values in payload
            if(!email || !password){
                throw new ApolloError('All Fields are required') //throw Error :)
            }
            const existingUser = await Users.findOne({ email }); // Finding already existing user
            if (!existingUser) { //if user not exist
              throw new ApolloError('User Not Found'+email,'USER_NOT_FOUND') // throw error using apollo Error
            }
           // Comparing password
          const isMatched = bcrypt.compareSync(password, existingUser.password);
          if (!isMatched) {
         // If password not matched
         throw new ApolloError('Invalid Password'+email,'INVALID_PASSWORD') // throw error using apollo Error
        }
        //Creating payload with user object
        let user={...existingUser._doc}
        delete user.password; // Removing password from user object
        const token=jwt.sign(user, tokenSecret, { expiresIn: '2h' }) //creating token 
        user.token=token //asigning token to user
        return{...user}  //BOM :) WILL RETURN EXPECTED USER
        },
        async updateUser(_, {updateInput: {email,name,number} }) {
            //update User Mutation
            if(!email ){
                throw new ApolloError('email is required')
            }
            const existingUser = await Users.findOne({ email }); // Finding already existing user
            if (!existingUser) { //if user not exist
              throw new ApolloError('User Not Found'+email,'USER_NOT_FOUND') // throw error using apollo Error
            }
           //Update its name and number 
           if(name){
            existingUser.name=name
           }
           if(number){
            existingUser.number=number
           }
            //saving user
            await existingUser.save()
            //return updated User BOOM :)
            return {...existingUser._doc};  
        }
    },
    Query: {
        User: (_, {ID}) => Users.findById(ID)
    }
}