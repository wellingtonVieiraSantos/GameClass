import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { AdminService } from './admin.service';
import * as adminDto from './dto/admin.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }
  
  @Get('/users')
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Retorna todos os usuários' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  findAll() {
    return this.adminService.getUsers()
  }

  @Get('/users/:id')
  @ApiOperation({ summary: 'Buscar usuário por id' })
  @ApiResponse({ status: 200, description: 'Retorna o usuário' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiParam({ name: 'id', description: 'Id do usuário' })
  findOne(@Param('id') id: string) {
    return this.adminService.getUser(id)
  }

  @Delete('/users/:id')
  @ApiOperation({ summary: 'Deletar usuário por id' })
  @ApiResponse({ status: 200, description: 'Deleta o usuário' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiParam({ name: 'id', description: 'Id do usuário' })
  remove(@Param('id') id: string) {
    return this.adminService.removeUser(id)
  }

  @Put('/users/:id')
  @ApiOperation({ summary: 'Atualizar usuário por id' })
  @ApiBody({ type: adminDto.UserUpdateDto })
  @ApiResponse({ status: 200, description: 'Atualiza o usuário' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBody({ type: adminDto.UserUpdateDto })
  @ApiParam({ name: 'id', description: 'Id do usuário' })
  update(@Param('id') id: string, @Body() body: adminDto.UserUpdateDto) {
    return this.adminService.updateUser(id, body)
  }
  
  @Post('/users')
  @ApiOperation({ summary: 'Criar usuário' })
  @ApiBody({ type: adminDto.UserCreateDto })
  @ApiResponse({ status: 201, description: 'Cria o usuário' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBody({ type: adminDto.UserCreateDto })
  create(@Body() body: adminDto.UserCreateDto) {
    return this.adminService.createUser(body)
  }
 
}
