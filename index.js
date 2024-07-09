const mongoose = require('mongoose');
const express = require('express')
require('dotenv/config')
const PORT = process.env.PORT;
const app = express()
const jwt = require('jsonwebtoken')
const cors = require('cors');
const User = require('./model/user');
const e = require('express');
app.use(express.json())
app.use(cors())
app.use(express.urlencoded())
app.get('/', (req, res) => res.send('Hello World!'))
mongoose.connect("mongodb+srv://nagledarshan12:Darshan108@dan.szrelsh.mongodb.net/?retryWrites=true&w=majority&appName=DAN").then(console.log("connected ")).catch((e) => console.log(e))
app.get('/api/user', async (req, res) => {
    try {
        const user = await User.find();
        // console.log(user);
        res.status(201).send(user);

    } catch (e) {
        console.log(e);
        res.send(500).send(e);
    }
});


app.post('/api/user', async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.create(req.body);
        console.log(user);
        res.status(201).send(user);

    } catch (e) {
        console.log(e);
        res.send(500).send(e);
    }
})

app.put('/api/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        var user = await User.findByIdAndUpdate(id, req.body);
        res.send(200), send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})
app.delete('/api/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        var user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(400).send("User not exist ");

        } else {
            res.status(200).send("user deleted");
        }

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

app.post("/login", async (req, res) => {
    let { email, password } = req.body;
    let exUser;
    try {
        exUser = await User.findOne({ email: email })
    } catch (error) {
        return next(error)
    }
    if (!exUser || exUser.password != password) {
        const err = new Error("wrong details")
        return next(err)
    }
    let token;
    try {
        token = jwt.sign({
            userId: exUser.id,
            email: exUser.email
        }, "mrdanprivatealgorithm", { expiresIn: '1h' });
    } catch (error) {
        console.log(error);
        const err = new Error("error")
        return next(err)
    }
    res.status(200).json({
        success: true,
        data: {
            userId: exUser.id,
            email: exUser.email,
            token: token
        }
    })
})

app.post("/signup", async (req, res, next) => {
    // const {name,email,password,number,age} = req.body;
    var newUser;
    try {

        newUser = await User.create(req.body);
    } catch (error) {
        console.log(e);
        return next(error)
    }
    let token;
    try {
        token = jwt.sign({
            userId: newUser.id,
            email: newUser.email
        },
            "mrdanprivatealgorithm", { expiresIn: '1h' })
    } catch (error) {
        return next(error)
    }
    res.status(201).json(
        {
            success: true,
            data: {
                userId: newUser.id,
                email: newUser.email,
                token: token

            }
        }
    )

})

app.get('/access',(req,res)=>{
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        res.status(200).json({
            success:false,
            message:"Error Token is Null"
        })
    }
    const decodedToken = jwt.verify(token,"mrdanprivatealgorithm");
    res.status(200).json({
        success:true,
        data:{
            userId:decodedToken.userId,
            email:decodedToken.email
        }
})})


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))