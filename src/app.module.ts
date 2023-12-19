import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { PrismaService } from 'src/providers/prisma'
import { UserModule, RoleModule } from 'src/api/index'
import { SECRET_KEY } from 'src/constants'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: SECRET_KEY,
      signOptions: {
        expiresIn: '3600s',
      },
    }),
    UserModule,
    RoleModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
