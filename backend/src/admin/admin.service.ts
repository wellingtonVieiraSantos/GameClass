import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import * as adminDto from './dto/admin.dto'
import { Role } from 'src/generated/prisma/enums'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) { }

  async getUsers() {
    return await this.prisma.user.findMany({
      where: {
        role: {
          not: Role.ADMIN
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true
      },
      orderBy: {
        name: 'asc'
      }
    })
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('Usuário não encontrado.')
    return user
  }

  async updateUser(id: string, data: adminDto.UserUpdateDto) {
    const user = await this.prisma.user.findUnique({ where: { id, role: {not: Role.ADMIN} } })
    if (!user) throw new NotFoundException('Usuário não encontrado ou não pode ser atualizado.')
    return await this.prisma.user.update({ where: { id }, data })
  }

  async removeUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id, role: {not: Role.ADMIN} } })
    if (!user) throw new NotFoundException('Usuário não encontrado ou não pode ser removido.')
    return await this.prisma.user.delete({ where: { id } })
  }

  async createUser(data: adminDto.UserCreateDto) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (user) throw new ConflictException('E-mail já cadastrado.')
    const hashedPassword = await bcrypt.hash(data.password, 10)
    return await this.prisma.user.create({ data: { ...data, password: hashedPassword } })
  }
}
