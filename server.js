import express from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const app = express()
app.use(express.json())
const port = process.env.PORT
const secret = process.env.SECRET

function authenticateToken(req, res, next) {
    console.log(req.headers['authorization'])
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secret, (err, userData) => {
        if (err)
            return res.sendStatus(403);
        else {
            req.user = userData;
            next();
        }
    })
}

app.get('/login', (req, res) => {
    const user = req.body

    jwt.sign(user, secret,{expiresIn: '30s'}, (err, token) => {
        if (!err)
            return res.send(token)
        else
            return res.sendStatus(510)
    })
})

app.get('/posts',authenticateToken, (req, res) => {
    res.json([{ id: 1, des: "hjhjh" }, { id: 2, des: "jkdjk" }])
})

app.listen(port)