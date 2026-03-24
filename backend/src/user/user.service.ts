import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Role } from 'src/generated/prisma/enums'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }
  
  async getMe(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email, role: {not: Role.ADMIN} } })
    if (!user) throw new NotFoundException('Usuário não encontrado ou não pode ser acessado.')
    return user
  }

  async updateMe(email: string, name: string) {
    const user = await this.prisma.user.findUnique({ where: { email, role: {not: Role.ADMIN} } })
    if (!user) throw new NotFoundException('Usuário não encontrado ou não pode ser atualizado.')
    return await this.prisma.user.update({ where: { email, role: {not: Role.ADMIN} }, data: { name } })
  }

  async updateAvatar(email: string, avatar: string) {
    const user = await this.prisma.user.findUnique({ where: { email, role: {not: Role.ADMIN} } })
    if (!user) throw new NotFoundException('Usuário não encontrado ou não pode ser atualizado.')
    return await this.prisma.user.update({ where: { email, role: {not: Role.ADMIN} }, data: { avatar } })
  }

  async updatePassword(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email, role: {not: Role.ADMIN} } })
    if (!user) throw new NotFoundException('Usuário não encontrado ou não pode ser atualizado.')
    const hashedPassword = await bcrypt.hash(password, 10)
    return await this.prisma.user.update({ where: { email, role: {not: Role.ADMIN} }, data: { password: hashedPassword } })
  }
}
