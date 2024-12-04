import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async index() {
    return this.userService.findAll();
  }

  @Post()
  async store(@Body() body: CreateUserDto) {
    return this.userService.store(body);
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    return this.userService.findOneByOrFail({ id });
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id') id: number) {
    await this.userService.destroy(id);
  }
}
