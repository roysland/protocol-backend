import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
dotenv.config()

const app = express();
const port = process.env.PORT || 3000 ;
const privateKey = process.env.TOKEN_SECRET
const prisma = new PrismaClient()
import userRoutes from './user/index.js'
import stoolRoutes from './stool/index.js'
// import authRoutes from './auth/index.js'
import periodRoutes from './period/index.js'
import supplementRoutes from './supplement/index.js'
import medicineRoutes from './medicine/index.js'
// app.options('*', )
app.use(cors())
app.use(bodyParser.json())
app.use(express.json());


app.use('/user', userRoutes)
app.use('/stool', stoolRoutes)

app.use('/period', periodRoutes)
app.use('/supplements', supplementRoutes)
app.use('/medicine', medicineRoutes)
// Handle token verification

app.post('/register', async (req, res) => {
    try {
        const userExists = await prisma.user.findFirst({
            where: {
                email: req.body.email
            }
        })
        if (userExists) {
            res.json({
                msg: 'User exists'
            })
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, async function (err, hash) {
                    const newUser = await prisma.user.create({
                        data: {
                            email: req.body.email,
                            name: '',
                            password: hash
                        }
                    })
                    const token = Jwt.sign({id: newUser.id, email: newUser.email, name: newUser.name }, privateKey, { expiresIn: '200h'})
                    res.json({
                        user: {
                            id: newUser.id,
                            name: newUser.name,
                            email: newUser.email,
                            token: token
                        }
                    })
                })
            })
        }
    } catch (e) {
        res.json({
            msg: 'Unknown error... Sorry'
        })
    }
    
})

app.get('/verify/:token', async (req, res) => {
    try {
        const valid = Jwt.verify(req.params.token, privateKey)
        const renew = Jwt.sign({id: valid.id, email: valid.email, name: valid.name }, privateKey, { expiresIn: '200h'})
        res.json({
            renewed: renew
        })
    } catch (e) {
        res.json({
            msg: 'token expired'
        })
    }
})


app.post('/login', async (req, res) => {
    const findUser = await prisma.user.findFirst({
        where: {
            email: req.body.email
        }
    })
    if (findUser) {
        bcrypt.compare(req.body.password, findUser.password, (err, result) => {
            if (err) {
                res.json({
                    msg: 'No such user, or combination of email and passord'
                })
            } else {
                const token = Jwt.sign({id: findUser.id, email: findUser.email, name: findUser.name }, privateKey, { expiresIn: '200h'})
                res.json({
                    user: {
                        id: findUser.id,
                        name: findUser.name,
                        email: findUser.email,
                        token: token
                    }
                })
            }
            
        })
    } else {
        res.json({
            msg: 'No such user, or combination of email and passord'
        })
    }
    
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});