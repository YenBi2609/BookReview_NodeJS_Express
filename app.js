const express = require('express')
const routes = require('./routes/book.js')
const jwt = require('jsonwebtoken')
const session = require('express-session')
const app = new express();

app.use(session({secret: "abcd"}))
app.use(express.json())

let users = []

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

const authenticatedUser = (username, password) => {
    let validUser = users.filter(u => u.username == username && u.password == password)
    if(validUser.length > 0){
        return true;
    }
    return false;
}

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) {
        return res.status(404).json({message: "Error logging in"})
    }

    if(authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data: password
        }, 'abc', { expiresIn: 60*60})
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in")
    }
    return res.status(208).json({message: "Invalid login. Please check username and password"})
})

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(!doesExist(username)){
            users.push({"username": username, "password": password})
            return res.status(200).json({message: "User successfully registred. Now you can login"})
        }
        return res.status(404).json({message: "User already exist! Please use other username"})
    }
    return res.status(404).json({message: "Unableto register user"})
})

app.use("/book", (req, res, next) => {
    if(req.session.authorization) {
        token = req.session.authorization["accessToken"];
        jwt.verify(token, "abc", (err, user) => {
            if(!err){
                req.user = user;
                next();
            }else {
                return res.status(403).json({message: "User not authenticated"})
            }
        })
    }else {
        return res.status(403).json({message: "User not logged in"})
    }
})

app.use('/book', routes)

app.listen(5000)