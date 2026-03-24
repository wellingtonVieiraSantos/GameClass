import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { ClassroomModule } from './classroom/classroom.module'
import { StudentModule } from './student/student.module'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth/auth.guard'
import { RolesGuard } from './common/guards/roles.guard'
import { AdminModule } from './admin/admin.module';
import { TimeModule } from './time/time.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        }
      ]
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    ClassroomModule,
    StudentModule,
    AdminModule,
    TimeModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
