import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from 'src/providers/prisma';
import { UserModule } from 'src/api/v1/user/user.module';
import { RoleModule } from 'src/api/v1/role/role.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    RoleModule
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
