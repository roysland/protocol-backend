import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export async function userRoute (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.sendStatus(401)
    }
    try {
        const validToken = await jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = validToken
        next()
    } catch {
        res.sendStatus(401)
    }
}