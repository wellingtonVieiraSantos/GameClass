import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger'
import { VersioningType, ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Pedagogico Api')
    .setDescription('Api privada para uso em app de gamificação pedagógica')
    .setVersion('1.0')
    .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
    'access-token',
  )
    .build()
  const documentFactory = (): OpenAPIObject =>
    SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(process.env.PORT ?? 3000)

  console.log(`\n\n`)
  console.log(`\x1b[32mAPPLICATION IS RUNNING ON:\x1b[33m http://localhost:3000\x1b[0m`)
  console.log(`\x1b[32mSWAGGER IS RUNNING ON:\x1b[33m http://localhost:3000/api\x1b[0m`)
  console.log(`\n\n`)
}
bootstrap()
