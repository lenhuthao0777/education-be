import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { hash, compare } from 'bcrypt'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/providers/prisma'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'

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

      res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 6000,
        sameSite: 'lax',
        secure: true,
      })

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

  findAll() {
    return `This action returns all user`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
