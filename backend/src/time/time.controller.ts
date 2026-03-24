import { Controller, Get } from '@nestjs/common';
import { TimeService } from './time.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('time')
@Controller('time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Public()
  @Get('current-week')
  @ApiOperation({ summary: 'Busca a semana atual' })
  @ApiResponse({ status: 200, description: 'Retorna a semana atual' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  getCurrentWeek() {
    return this.timeService.getCurrentWeek();
  }
}
