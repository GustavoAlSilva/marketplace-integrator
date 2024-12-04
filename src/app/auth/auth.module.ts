import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/app/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
