import Express from "express";
const router = Express.Router()
import { Prisma, PrismaClient } from '@prisma/client'
import { userRoute } from "../utils/userRoute.js";


const prisma = new PrismaClient()

router.post('/', userRoute, async (req, res) => {
    let endDate = new Date(2099, 1, 1)
    if (req.body.endDate) {
        endDate = new Date(req.body.end)
    }
    const medicine = await prisma.medicine.create({
        data: {
            name: req.body.name,
            when: req.body.when,
            startDate: new Date(req.body.start),
            userId: req.user.id
        }
    })
    res.json({
        data: medicine
    })
})

router.get('/all', userRoute, async (req, res) => {
    const medicine = await prisma.medicine.findMany({
        where: {
            userId: req.user.id,
            OR: [
                {
                    endDate: {
                        gte: new Date()
                    }
                },
                {
                    endDate: null
                }
            ]
        },
        orderBy: {
            startDate: 'desc'
        }
    })
    res.json({
        medicine: medicine
    })
})

router.get('/today', userRoute, async (req, res) => {
    const today = new Date().setHours(0,0,0,0)
    const medicine = await prisma.medicine.findMany({
        where: {
            userId: req.user.id,
            startDate: {
                lte: new Date(today)
            }
        },
        orderBy: {
            startDate: 'desc'
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

router.put('/check/:id', userRoute, async (req, res) => {
    const checked = req.body.checked
    const history = await prisma.MedicineHistory.update({
        where: {
            id: req.params.id
        },
        data: {
            checked: checked
        }
    })
    return res.json({
        updated: history
    })
})

router.post('/check', userRoute, async (req, res) => {
    const med = req.body
    const history = await prisma.MedicineHistory.create({
        data: {
            userId: req.user.id,
            medicineId: med.id,
            checked: med.checked
        }
    })
    
    res.json({
        history: history
    })
})
export default router