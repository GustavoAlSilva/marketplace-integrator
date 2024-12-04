import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchEntity } from './search.entity';
import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SearchEntity]),
    UserModule,
    HttpModule,
  ],
  controllers: [SearchController],
  providers: [SearchService, EmailService],
  exports: [SearchService],
})
export class SearchModule {}
