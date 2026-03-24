import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'fallback-dev',
        signOptions: { expiresIn: '900s' }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
