import { PrismaClient, RoleType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const roles = [
    {
      type: 'ADMIN',
    },
    {
      type: 'STUDENT',
    },
    {
      type: 'TEACHER',
    },
  ]

  for await (const item of roles) {
    await prisma.role.create({
      data: {
        type: item.type as RoleType,
      },
    })
  }

  const blocks = [
    {
      name: '10',
    },
    {
      name: '11',
    },
    {
      name: '12',
    },
  ]

  for await (const item of blocks) {
    await prisma.block.create({
      data: {
        name: item.name,
      },
    })
  }
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
