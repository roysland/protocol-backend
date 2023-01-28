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

router.post('/check', userRoute, async (req, res) => {
    const history = await prisma.supplementTracker.create({
        data: {
            userId: req.user.id,
            checked: true,
            supplementId: req.body.id
        }
    })
    res.json({
        history: history
    })
})

router.get('/', userRoute, async (req, res) => {
    const supplements = await prisma.supplement.findMany({
        where: {
            userId: req.user.id,
            active: true
        }
    })
    res.json({
        supplements: supplements
    })
})

router.get('/today', userRoute, async (req, res) => {
    const today = new Date().setHours(0,0,0,0)
    const medicine = await prisma.supplement.findMany({
        where: {
            userId: req.user.id,
            active: true
        },
        include: {
            history: {
                select: {
                    checked: true,
                    createdAt: true
                },
                where: {
                    createdAt: {
                        gte: new Date(today)
                    }
                }
            }
        }
    })
    res.json({
        today: medicine
    })
})

router.post('/delete', userRoute, async (req, res) => {
    await prisma.supplement.updateMany({
        where: {
            userId: req.user.id,
            id: {
                in: req.body.items
            }
        },
        data: {
            active: false
        } 
    })
    console.log(req.body)
    res.json({
        deleted: 'things'
    })
})

export default router