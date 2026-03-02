const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Iamnotgivingup";
app.use(express.json());
const users = [];

function signinHandler(req,res){
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;
    for(let i =0;i<users.length;i++){
        if(users[i].username == username&& users[i].password==password){
            foundUser= users[i]
        }
    }

    if(foundUser){
        const token = jwt.sign({ //function signature of jwt 
            username:username
        } , JWT_SECRET) //therefore we are converting the username into a token using the jwt_secret key 

        //now we dont  have to store it in the memory anymore , as it is a stateless token , we dont need any validation from database
        res.json({
            token:token,
            message: " Authorised user "
        })
    }else{
        res.status(403).json({
            message: "Unauthorised user"
        })
    }


}

function signupHandler(req,res){
    const  username = req.body.username;
    const  password = req.body.password;

    if(username.length < 5 ){
        res.json({
            message : " the username should be more than 5 character "
        })
    }else{
        users.push({
            username:username,
            password:password
        })
        res.json({
            message:"You are signedup"
        })
    }

}

app.get("/me",function(req,res){
    const token = req.headers.token //jwt 
    
    const decodedinformation = jwt.verify(token,JWT_SECRET); //{username:"gauravkumar@gmail.com"} . therefore we have to give secret key for decoding the process too and stored it in decodedinformation
    const username = decodedinformation.username

    let foundUser = null; 

    for(let i = 0;i<users.length;i++){
        if(users[i].username == username){
            foundUser = users[i]
        }
    }
    
    if(foundUser){
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    }else{
        res.json({
            message:"invalid token"
        })
    }

})

app.post('/signin',signinHandler);
app.post('/signup',signupHandler);

const port = 3000;

app.listen(port,()=>{
    console.log(`this server is running on port ${port}`)
})