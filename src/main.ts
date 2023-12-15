import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)

  app.use(cookieParser())

  app.enableCors({
    origin: ['http://localhost:3000', 'https://education-pj.vercel.app'],
    credentials: true,
  })

  await app.listen(config.get('PORT'))
}
bootstrap()
