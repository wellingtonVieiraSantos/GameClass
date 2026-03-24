import { Body, Controller, Get, Put } from '@nestjs/common'
import { UserService } from './user.service'
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import * as userDto from './dto/user.dto'

@ApiTags('user')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private readonly users: UserService) { }

  @Get('me')
  @ApiOperation({ summary: 'Busca o usuário logado' })
  @ApiResponse({ status: 200, description: 'Retorna o usuário logado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  getMe(@CurrentUser('email') email: string) {
    return this.users.getMe(email)
  }

  @Put('me/avatar')
  @ApiOperation({ summary: 'Atualiza o avatar do usuário' })
  @ApiBody({ type: userDto.UserUpdateAvatarDto })
  @ApiResponse({ status: 200, description: 'Retorna o usuário atualizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  updateAvatar(@CurrentUser('email') email: string, @Body() body: userDto.UserUpdateAvatarDto) {
    return this.users.updateAvatar(email, body.avatar)
  }

  @Put('me/name')
  @ApiOperation({ summary: 'Atualiza o nome do usuário' })
  @ApiBody({ type: userDto.UserUpdateNameDto })
  @ApiResponse({ status: 200, description: 'Retorna o usuário atualizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  updateMe(@CurrentUser('email') email: string, @Body() body: userDto.UserUpdateNameDto) {
    return this.users.updateMe(email, body.name)
  }

  @Put('me/password')
  @ApiOperation({ summary: 'Atualiza a senha do usuário' })
  @ApiBody({ type: userDto.UserUpdatePasswordDto })
  @ApiResponse({ status: 200, description: 'Retorna o usuário atualizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  updatePassword(@CurrentUser('email') email: string, @Body() body: userDto.UserUpdatePasswordDto) {
    return this.users.updatePassword(email, body.password)
  }
}
