import { Controller, Get, Param, Post } from '@nestjs/common'
import { StudentService } from './student.service'
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { Role } from 'src/generated/prisma/enums'

@ApiTags('student')
@ApiBearerAuth('access-token')
@Roles(Role.STUDENT)
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('/badges')
  @ApiOperation({ summary: 'Busca os badges ganhos pelo aluno' })
  @ApiResponse({ status: 200, description: 'Retorna os badges ganhos pelo aluno' })
  @ApiResponse({ status: 404, description: 'Aluno não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  getEarnedBadges(@CurrentUser('sub') id: string) {
    return this.studentService.getEarnedBadges(id)
  }

  @Post('/badges/:id/equip')
  @ApiOperation({ summary: 'Equipa um badge' })
  @ApiResponse({ status: 201, description: 'Badge equipado com sucesso' })
  @ApiResponse({ status: 404, description: 'Badge não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiParam({ name: 'id', description: 'ID do badge' })
  equipBadge(
    @Param('id') badgeId: string,
    @CurrentUser('sub') id: string
  ) {
    return this.studentService.equipBadge(id, badgeId)
  }

  @Get('/classrooms')
  @ApiOperation({ summary: 'Busca a sala do aluno' })
  @ApiResponse({ status: 200, description: 'Retorna a sala do aluno' })
  @ApiResponse({ status: 404, description: 'Aluno não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  getClassroom(@CurrentUser('sub') id: string) {
    return this.studentService.getClassroom(id)
  }
  
  @Get('/classmates')
  @ApiOperation({ summary: 'Busca os colegas de sala do aluno' })
  @ApiResponse({ status: 200, description: 'Retorna os colegas de sala do aluno' })
  @ApiResponse({ status: 404, description: 'Aluno não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  getClassmates(@CurrentUser('sub') id: string) {
    return this.studentService.getClassmates(id)
  }
}

