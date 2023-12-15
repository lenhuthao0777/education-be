import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { PrismaService } from 'src/providers/prisma'
import { UserModule, RoleModule } from 'src/api/index'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: 'school',
      signOptions: {
        expiresIn: '60s',
      },
    }),
    UserModule,
    RoleModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
