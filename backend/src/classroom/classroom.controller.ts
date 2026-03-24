import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ClassroomService } from './classroom.service'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { Role } from 'src/generated/prisma/enums'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ClassroomGuard } from './classroom.guard'
import * as classroomDto from './dto/classroom.dto'
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator'

@ApiTags('classroom')
@ApiBearerAuth('access-token')
@UseGuards(ClassroomGuard)
@Roles(Role.TEACHER)
@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get(':id/students')
  @ApiOperation({ summary: 'Busca os alunos de uma turma' })
  @ApiResponse({ status: 200, description: 'Retorna os alunos da turma' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiParam({ name: 'id', description: 'Id da turma' })
  getStudents(
    @Param('id') classroomId: string,
  ) {
    return this.classroomService.getStudents(classroomId)
  }

  @Post(':id/students/:studentId')
  @ApiOperation({ summary: 'Adiciona um aluno a uma turma' })
  @ApiResponse({ status: 201, description: 'Aluno adicionado com sucesso' })
  @ApiResponse({ status: 400, description: 'Aluno já está na turma' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiParam({ name: 'id', description: 'Id da turma' })
  @ApiParam({ name: 'studentId', description: 'Id do aluno' })
  postStudent(
    @Param('id') classroomId: string,
    @Param('studentId') studentId: string
  ) {
    return this.classroomService.postStudent(classroomId, studentId)
  }

  @Delete(':id/students/:studentId')
  @ApiOperation({ summary: 'Remove um aluno de uma turma' })
  @ApiResponse({ status: 200, description: 'Aluno removido com sucesso' })
  @ApiResponse({ status: 400, description: 'Aluno não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiParam({ name: 'id', description: 'Id da turma' })
  @ApiParam({ name: 'studentId', description: 'Id do aluno' })
  deleteStudent(
    @Param('id') classroomId: string,
    @Param('studentId') studentId: string
  ) {
    return this.classroomService.deleteStudent(classroomId, studentId)
  }

  @Get(':id/badges')
  @ApiOperation({ summary: 'Busca os badges de uma turma' })
  @ApiResponse({ status: 200, description: 'Retorna os badges da turma' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiParam({ name: 'id', description: 'Id da turma' })
  getBadges(
    @Param('id') classroomId: string,
  ) {
    return this.classroomService.getBadges(classroomId)
  }

  @Post(':id/badges')
  @ApiOperation({ summary: 'Adiciona um badge a uma turma' })
  @ApiResponse({ status: 201, description: 'Badge adicionado com sucesso' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiParam({ name: 'id', description: 'Id da turma' })
  @ApiBody({ type: classroomDto.BadgeCreateDto })
  postBadge(
    @Param('id') classroomId: string,
    @Body() badge: classroomDto.BadgeCreateDto
  ) {
    return this.classroomService.postBadge(classroomId, badge)
  }

  @Delete(':id/badges/:badgeId')
  @ApiOperation({ summary: 'Remove um badge de uma turma' })
  @ApiResponse({ status: 200, description: 'Badge removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiParam({ name: 'id', description: 'Id da turma' })
  @ApiParam({ name: 'badgeId', description: 'Id do badge' })
  deleteBadge(
    @Param('id') classroomId: string,
    @Param('badgeId') badgeId: string
  ) {
    return this.classroomService.deleteBadge(classroomId, badgeId)
  }

  @Put(':id/badges/:badgeId')
  @ApiOperation({ summary: 'Atualiza um badge de uma turma' })
  @ApiResponse({ status: 200, description: 'Badge atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiParam({ name: 'id', description: 'Id da turma' })
  @ApiParam({ name: 'badgeId', description: 'Id do badge' })
  @ApiBody({ type: classroomDto.BadgeUpdateDto })
  updateBadge(
    @Param('id') classroomId: string,
    @Param('badgeId') badgeId: string,
    @Body() badge: classroomDto.BadgeUpdateDto
  ) {
    return this.classroomService.updateBadge(classroomId, badgeId, badge)
  }

  @Post(':id/students/:studentId/scores')
  @ApiOperation({ summary: 'Adiciona ou atualiza uma pontuação de um aluno' })
  @ApiResponse({ status: 201, description: 'Pontuação adicionada com sucesso' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiParam({ name: 'id', description: 'Id da turma' })
  @ApiParam({ name: 'studentId', description: 'Id do aluno' })
  @ApiBody({ type: classroomDto.StudentScoreDto })
  postStudentScore(
    @Param('id') classroomId: string,
    @Param('studentId') studentId: string,
    @Body() studentScore: classroomDto.StudentScoreDto
  ) {
    return this.classroomService.postStudentScore(classroomId, studentId, studentScore)
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma turma' })
  @ApiResponse({ status: 201, description: 'Turma criada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBody({ schema: { type: 'object', properties: { name: { type: 'string' } } } })
  createClassroom(
    @CurrentUser('sub') teacherId: string,
    @Body('name') name: string
  ) {
    return this.classroomService.createClassroom(teacherId, name)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma turma' })
  @ApiResponse({ status: 200, description: 'Turma removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiParam({ name: 'id', description: 'Id da turma' })
  deleteClassroom(
    @Param('id') classroomId: string,
  ) {
    return this.classroomService.deleteClassroom(classroomId)
  }
}
