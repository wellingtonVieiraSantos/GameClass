import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { ClassroomGuard } from './classroom.guard';

@Module({
  providers: [ClassroomService, ClassroomGuard],
  controllers: [ClassroomController]
})
export class ClassroomModule {}
