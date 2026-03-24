import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import * as auth from './dto/auth.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './types/jwtPayload.type'
import * as crypto from 'crypto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) { }
  
  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex')
  }

  async register(data: auth.RegisterDto) {
    const emailExists = await this.prisma.user.findUnique({
      where: { email: data.email }
    })
    if (emailExists) throw new ConflictException('E-mail já cadastrado.')

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }

  async login(data: auth.LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    })

    if (!user) throw new NotFoundException('E-mail e/ou senha incorretos.')

    const matcherPassword = await bcrypt.compare(data.password, user.password)

    if (!matcherPassword)
      throw new NotFoundException('E-mail e/ou senha incorretos.')

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = await this.jwt.signAsync(payload)
    const refreshToken = this.generateRefreshToken()

    await this.prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: refreshToken,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }

  async refreshToken(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { sessionToken: refreshToken },
      select: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        },
        expires: true
      }
    })

    if (!session || session.expires < new Date()) throw new UnauthorizedException('Sessão expirada ou inválida.')
    
    const newRefreshToken = this.generateRefreshToken()
    const user = session.user 

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = await this.jwt.signAsync(payload)
    
    await this.prisma.session.update({
      where: { sessionToken: refreshToken },
      data: {
        sessionToken: newRefreshToken,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })
    
    return {
      access_token: accessToken,
      refresh_token: newRefreshToken
    }
  }

  async logout(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { sessionToken: refreshToken }
    })
    if (!session) throw new UnauthorizedException('Sessão expirada ou inválida.')
    await this.prisma.session.delete({
      where: { sessionToken: refreshToken }
    })
    return { message: 'Sessão encerrada com sucesso.' }
  }
}
