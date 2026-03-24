import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async getEarnedBadges(studentId: string) {
    return await this.prisma.studentBadge.findMany({
      where: {
        studentId
      },
      select: {
        badge: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
            rarity: true
          }
        }
      },
      orderBy: {
        earnedAt: 'desc'
      }
    })
  }

  async equipBadge(studentId: string, badgeId: string) {
    const student = await this.prisma.student.findUnique({
      where: {
        id: studentId
      },
      select: {
        classroomId: true
      }
    })

    if (!student) {
      throw new NotFoundException('Aluno não encontrado')
    }

    const badge = await this.prisma.studentBadge.findUnique({
      where: {
        studentId_badgeId_classroomId: {
          studentId,
          badgeId,
          classroomId: student.classroomId
        }
      }
    })

    if (!badge) {
      throw new NotFoundException('Medalha não encontrada')
    }

    const [, equippedBadge] = await this.prisma.$transaction([
      this.prisma.studentBadge.updateMany({
        where: {
          studentId,
          classroomId: student.classroomId,
          isEquipped: true
        },
        data: {
          isEquipped: false
        }
      }),
      this.prisma.studentBadge.update({
        where: {
          studentId_badgeId_classroomId: {
            studentId,
            badgeId,
            classroomId: student.classroomId
          }
        },
        data: {
          isEquipped: true
        }
      })
    ])

    return equippedBadge
  }

  async getClassroom(studentId: string) {
    return await this.prisma.student.findUnique({
      where: {
        id: studentId
      },
      select: {
        classroom: {
          select: {
            id: true,
            name: true,
            schoolYear: true,
            teacher: {
              select: {
                user: {
                  select: {
                    name: true,
                    avatar: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  async getClassmates(studentId: string) {
    return await this.prisma.student.findUnique({
      where: {
        id: studentId
      },
      select: {
        classroom: {
          select: {
            students: {
              where: {
                id: {
                  not: studentId
                }
              },
              select: {
                badges: {
                  where: {
                    isEquipped: true
                  },
                  select: {
                    badge: {
                      select: {
                        id: true,
                        name: true,
                        description: true,
                        icon: true,
                        rarity: true
                      }
                    }
                  }
                },
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }
}

