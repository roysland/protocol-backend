import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.stoolType.deleteMany()
  await prisma.stoolType.create({
    data: {
      name: 'Harde klumper',
      bristolValue: 1,
      description: 'Forstoppet',
      image: 'stool-type-1.png'
    }
  })
  await prisma.stoolType.create({
    data: {
      name: 'Klumpete kabel',
      bristolValue: 2,
      description: 'Forstoppet',
      image: 'stool-type-2.png'
    }
  })
  await prisma.stoolType.create({
    data: {
      name: 'Kabel med tekstur',
      bristolValue: 3,
      description: 'Normal',
      image: 'stool-type-3.png'
    }
  })
  await prisma.stoolType.create({
    data: {
      name: 'Myk kabel',
      bristolValue: 4,
      description: 'Normal',
      image: 'stool-type-4.png'
    }
  })
  await prisma.stoolType.create({
    data: {
      name: 'Myke småbiter',
      bristolValue: 5,
      description: 'Løs mage',
      image: 'stool-type-5.png'
    }
  })
  await prisma.stoolType.create({
    data: {
      name: 'Grøtete',
      bristolValue: 6,
      description: 'Diaré',
      image: 'stool-type-6.png'
    }
  })
  await prisma.stoolType.create({
    data: {
      name: 'Vannete',
      bristolValue: 7,
      description: 'Ekstrem diaré',
      image: 'stool-type-7.png'
    }
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })