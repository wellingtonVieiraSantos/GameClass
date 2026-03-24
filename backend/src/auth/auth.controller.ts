import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common'
import * as authDto from './dto/auth.dto'
import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Realizar cadastro' })
  @ApiBody({ type: authDto.RegisterDto })
  @ApiResponse({ status: 201, description: 'Retorna id, nome e email do usuário cadastrado' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  register(@Body() body: authDto.RegisterDto) {
    return this.authService.register(body)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Realizar login' })
  @ApiBody({ type: authDto.LoginDto })
  @ApiResponse({ status: 200, description: 'Retorna o access token e refresh token' })
  @ApiResponse({ status: 404, description: 'E-mail e/ou senha incorretos' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  login(@Body() body: authDto.LoginDto) {
    return this.authService.login(body)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Realizar refresh token' })
  @ApiBody({ type: authDto.RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Retorna novos access token e refresh token' })
  @ApiResponse({ status: 401, description: 'Sessão expirada ou inválida' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  refreshToken(@Body() body: authDto.RefreshTokenDto) {
    return this.authService.refreshToken(body.refresh_token)
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'Realizar logout' })
  @ApiBody({ type: authDto.RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Deleta o refresh token e retorna uma mensagem de sucesso' })
  @ApiResponse({ status: 401, description: 'Sessão expirada ou inválida' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  logout(@Body() body: authDto.RefreshTokenDto) {
    return this.authService.logout(body.refresh_token)
  }
}
