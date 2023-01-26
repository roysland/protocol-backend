import Express from "express";
import { PrismaClient } from '@prisma/client'
import WebAuthn from 'webauthn'
import dotenv from 'dotenv'
const prisma = new PrismaClient()
const router = Express.Router()
dotenv.config()
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* async function verify (params) {
    const ticket = await client.verifyIdToken({
        idToken: params.credential,
        audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    return payload
} */

/* async function loginUser (params) {
    const exists = await prisma.user.findFirst({
        where: {
            email: params.email
        }
    })
    
    if (!exists) {
        const user = await prisma.user.create({
            data: {
                email: params.email,
                name: params.name
            }
        })
        return user
    } else {
        return exists
    }
} */

/* router.post('/', async (req, res, next) => {
    const params = req.body
    const usr = await verify(params)
    let user = await loginUser(usr)
    const token = jwt.sign(user, process.env.TOKEN_SECRET)
    res.json({
        user: Object.assign(user, {token: token, params: params})
    })
}) */


const webauthn = new WebAuthn({
    origin: `http://localhost:${process.env.port}`,
    usernameField: 'username',
    userFields: {
        username: 'username',
        name: 'displayName'
    },
    store: {
        put: async (id, value) => {
            console.log(id, value)
        },
        get: async (id) => {
            console.log(id)
        },
        search: async (search) => {
            console.log(search)
        },
        delete: async (id) => {
            console.log(id)
            return true
        }
    }
})
router.use('/webauth', webauthn.initialize())

router.post('/secret', webauthn.authenticate(), async (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'super secret'
    })
    
})



export default router