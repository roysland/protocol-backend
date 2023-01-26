import Express from "express";
const router = Express.Router()
import { Prisma, PrismaClient } from '@prisma/client'
import { userRoute } from "../utils/userRoute.js";
const prisma = new PrismaClient()
router.get('/types', async (req, res) => {
    const stoolTypes = await prisma.stoolType.findMany()
    res.set('Cache-Control', 'public, max-age=31557600, s-maxage=31557600');
    res.json({
        stoolTypes: stoolTypes
    })
})

router.get('/stools', userRoute, async (req, res) => {
    const stools = await prisma.stool.findMany({
        where: {
            userId: req.user.id
        },
        include: {
            stool: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    
    res.json({
        stools: stools
    })
})

router.post('/', userRoute, async (req, res) => {
    const saveStool = await prisma.stool.create({
        data: {
            stoolId: Number(req.body.stoolId),
            userId: Number(req.user.id)
        }
    })
    console.log(req.user)
    res.json({
        saved: saveStool
    })
})


export default router