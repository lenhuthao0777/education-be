import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { PrismaService } from 'src/providers/prisma'
@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}
  async roles() {
    try {
      const roles = this.prisma.role.findMany()
      return roles
    } catch (error) {
      throw new InternalServerErrorException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      )
    }
  }
}
