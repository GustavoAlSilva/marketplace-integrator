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
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';

@Controller('api/v1/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async index() {
    return this.searchService.findAll();
  }

  @Post()
  async store(@Body() body: CreateSearchDto) {
    return this.searchService.store(body);
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    return this.searchService.findOneByOrFail({ id });
  }

  @Get('user/:userId')
  async findAllByUserId(@Param('userId') userId: number) {
    return this.searchService.findAllByUserId(userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateSearchDto,
  ) {
    return this.searchService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id') id: number) {
    await this.searchService.destroy(id);
  }
}
