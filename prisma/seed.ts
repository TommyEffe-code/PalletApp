import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const departments = ['Freschi LS']
  const password = '1234' // In a real app, hash this!

  for (const name of departments) {
    await prisma.department.upsert({
      where: { name },
      update: { password },
      create: {
        name,
        password,
      },
    })
  }

  console.log('Seeding finished.')
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
