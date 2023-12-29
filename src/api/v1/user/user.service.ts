import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { hash, compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/providers/prisma'
import { Filters } from './dto/filter-user.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async create(input: CreateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      })

      if (user) {
        return new HttpException('Conflict', HttpStatus.CONFLICT)
      }

      const hashPass = await hash(input.password, 10)
      await this.prisma.user.create({
        data: {
          email: input.email,
          password: hashPass,
          roleId: input.roleId,
        },
      })

      return 'Create User Success'
    } catch (error) {
      throw new InternalServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async login(res: Response, input: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      })

      const checkPass = await compare(input.password, user.password)

      if (!user || !checkPass) {
        return 'password or email valid'
      }

      const token = await this.jwt.signAsync({
        userId: user.id,
        email: user.email,
      })

      // res.cookie('access_token', token, {
      //   httpOnly: true,
      //   maxAge: 6000,
      //   sameSite: process.env.NODE_ENV === 'development' ? true : 'none',
      //   secure: process.env.NODE_ENV === 'production',
      //   domain: '/',
      // })

      return {
        id: user.id,
        email: user.email,
        token,
      }
    } catch (error) {
      throw new InternalServerErrorException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      )
    }
  }

  logout(res: Response) {
    try {
      res.clearCookie('access_token')
      return 'Logout'
    } catch (error) {
      throw new InternalServerErrorException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      )
    }
  }

  async users(filters: Filters) {
    try {
      let userCount = 0

      userCount = await this.prisma.user.count({
        where: {
          AND: [
            {
              email: {
                contains: filters.email,
              },
            },
            {
              roleId: filters.roleId,
            },
          ],
        },
      })

      const users = await this.prisma.user.findMany({
        where: {
          AND: [
            {
              email: {
                contains: filters.email,
              },
            },
            {
              roleId: filters.roleId,
            },
          ],
        },
        take: Number(filters.limit),
        skip: (Number(filters.page) - 1) * Number(filters.limit),
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          email: true,
          active: true,
          role: {
            select: {
              id: true,
              type: true,
            },
          },
          profile: {
            select: {
              id: true,
              lastName: true,
              firstName: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      })

      return {
        data: users,
        totalPage: Math.ceil(userCount / Number(filters.limit)),
        page: filters.page,
        limit: filters.limit,
      }
    } catch (error) {
      throw new InternalServerErrorException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      )
    }
  }

  async user(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          role: {
            select: {
              id: true,
              type: true,
            },
          },
        },
      })
      return user
    } catch (error) {
      throw new InternalServerErrorException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      )
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      })
      return 'Delete success!'
    } catch (error) {
      throw new InternalServerErrorException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      )
    }
  }
}
