import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)

  app.use(cookieParser())

  app.enableCors()

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  app.setGlobalPrefix('api/v1')

  await app.listen(config.get('PORT'))
}
bootstrap()
