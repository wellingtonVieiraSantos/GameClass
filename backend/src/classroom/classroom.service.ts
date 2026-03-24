import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { BadgeCreateDto, BadgeUpdateDto, StudentScoreDto } from './dto/classroom.dto'

@Injectable()
export class ClassroomService {
  constructor(private readonly prisma: PrismaService) {}

  async createClassroom(teacherId: string, name: string) {
    return await this.prisma.classroom.create({
      data: {
        teacherId,
        name,
        schoolYear: new Date().getFullYear()
      }
    })

  }

  async deleteClassroom(classroomId: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id: classroomId }
    })

    if (!classroom) {
      throw new NotFoundException('Turma não encontrada.')
    }

    return this.prisma.classroom.delete({
      where: { id: classroomId }
    })
  }

  async postStudentScore(classroomId: string, studentId: string, student: StudentScoreDto) {
    return await this.prisma.weeklyScore.upsert({
      where: {
        studentId_week_year_classroomId: {
          studentId,
          week: student.week,
          year: student.year,
          classroomId
        }
      },
      update: {
        score: student.isIncrease ? { increment: student.score } : { decrement: student.score },
        reason: student.reason
      },
      create: {
        classroomId,
        studentId,
        score: student.score,
        week: student.week,
        year: student.year,
        reason: student.reason
      }
    })
  }

  async getStudents(classroomId: string) {
    return await this.prisma.student.findMany({
      where: {
        classroomId,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          }
        },
        weeklyScores: {
          select: {
            score: true,
            week: true,
            year: true,
            reason: true
          }
        },
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })
  }

  async postStudent(classroomId: string, studentId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: studentId }
    })

    if (!user) {
      throw new BadRequestException('Usuário não encontrado.')
    }

    const existingStudent = await this.prisma.student.findFirst({
      where: { classroomId, userId: user.id }
    })

    if (existingStudent) {
      throw new BadRequestException('Este aluno já está na turma.')
    }

    return this.prisma.student.create({
      data: {
        classroomId,
        userId: user.id
      }
    })
  }

  async deleteStudent(classroomId: string, studentId: string) {
    const student = await this.prisma.student.findFirst({
      where: { classroomId, id: studentId }
    })

    if (!student) {
      throw new NotFoundException('Aluno não está nesta turma.')
    }

    return this.prisma.student.delete({
      where: {
        id: student.id
      }
    })
  }

  async getBadges(classroomId: string) {
    return await this.prisma.badge.findMany({
      where: {
        classroomId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        rarity: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async postBadge(classroomId: string, badge: BadgeCreateDto) {
    return this.prisma.badge.create({
      data: {
        classroomId,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity
      }
    })
  }

  async deleteBadge(classroomId: string, badgeId: string) {
    const badge = await this.prisma.badge.findFirst({
      where: {
        id: badgeId,
        classroomId
      }
    })

    if (!badge) {
      throw new NotFoundException('Badge não encontrado.')
    }

    return this.prisma.badge.delete({
      where: {
        id: badgeId
      }
    })
  }

  async updateBadge(classroomId: string, badgeId: string, badge: BadgeUpdateDto) {
    const badgeFound = await this.prisma.badge.findFirst({
      where: {
        id: badgeId,
        classroomId
      }
    })

    if (!badgeFound) {
      throw new NotFoundException('Badge não encontrado.')
    }

    return this.prisma.badge.update({
      where: {
        id: badgeId
      },
      data: {
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity
      }
    })
  }
}
