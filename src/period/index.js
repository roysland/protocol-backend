import Express from "express";
const router = Express.Router()
import { PrismaClient } from '@prisma/client'
import { userRoute } from "../utils/userRoute.js";

const prisma = new PrismaClient()

router.get('/', userRoute, async (req, res) => {
    const periods = await prisma.period.findMany({
        where: {
            userId: req.user.id
        },
        orderBy: [
            {
                createdAt: 'desc'
            }
        ]
    })
    res.json({
        periods: periods
    })
})
// Register period start
router.post('/', userRoute, async (req, res) => {
    const start = await prisma.period.create({
        data: {
            userId: Number(req.user.id),
            createdAt: new Date(req.body.createdAt)
        }
    })
    
    res.json({
        data: start
    })
})

export default router