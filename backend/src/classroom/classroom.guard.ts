import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ClassroomGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const classroomId = request.params.id as string
    const id = request.user.sub as string

    const classroom = await this.prisma.classroom.findUnique({
      where: {
        id: classroomId,
      },
      select: {
        teacher: {
          select: {
            userId: true
          }
        }
      }
    })

    if (!classroom) {
      throw new NotFoundException('Turma não encontrada')
    }

    if (classroom.teacher.userId !== id) {
      throw new UnauthorizedException('Você não tem permissão para acessar esta turma')
    }

    return true
  }
}