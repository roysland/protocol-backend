import Express from "express";
const router = Express.Router()
import { Prisma, PrismaClient } from '@prisma/client'
import { userRoute } from "../utils/userRoute.js";
const prisma = new PrismaClient()

router.post('/', userRoute, async (req, res) => {
    const supplement = req.body
    console.log(supplement)
    const supp = await prisma.supplement.create({
        data: {
            name: supplement.name,
            when: supplement.when,
            userId: req.user.id
        }
    })
    res.json({
        supplement: supp
    })
})

router.get('/', userRoute, async (req, res) => {
    const supplements = await prisma.supplement.findMany({
        where: {
            userId: req.user.id
        }
    })
    res.json({
        supplements: supplements
    })
})

router.post('/delete', userRoute, async (req, res) => {
    await prisma.supplement.deleteMany({
        where: {
            userId: req.user.id,
            id: {
                in: req.body.items
            }
        }
    })
    console.log(req.body)
    res.json({
        deleted: 'things'
    })
})

export default router