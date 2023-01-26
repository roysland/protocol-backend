import Express from "express";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const router = Express.Router()
import { userRoute } from "../utils/userRoute.js";

router.get('/me', userRoute, async (req, res) => {
    const user = await prisma.user.findFirst({
        where: {
            id: req.user.id
        }
    })
    res.json({
        user: user
    })
})


export default router