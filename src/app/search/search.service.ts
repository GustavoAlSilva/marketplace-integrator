import { Injectable, NotFoundException } from '@nestjs/common';
import { SearchEntity } from './search.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UpdateSearchDto } from './dto/update-search.dto';
import { CreateSearchDto } from './dto/create-search.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(SearchEntity)
    private readonly searchRepository: Repository<SearchEntity>,
    private readonly userService: UserService,
  ) {}

  async findAll() {
    return this.searchRepository.find({
      select: ['id', 'query', 'maxPrice', 'isActive'],
    });
  }

  async findOneByOrFail(
    where: FindOptionsWhere<SearchEntity> | FindOptionsWhere<SearchEntity>[],
  ) {
    try {
      return this.searchRepository.findOneByOrFail(where);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findAllByUserId(userId: number) {
    return this.searchRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async store(data: CreateSearchDto) {
    const user = await this.userService.findOneByOrFail({ id: data.userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

     const search = this.searchRepository.create({
      ...data,
      user,
    });

    return this.searchRepository.save(search);
  }

  async update(id: number, data: UpdateSearchDto) {
    const search = await this.findOneByOrFail({ id });
    this.searchRepository.merge(search, data);
    return this.searchRepository.save(search);
  }

  async destroy(id: number) {
    await this.searchRepository.findOneByOrFail({ id });
    this.searchRepository.softDelete({ id });
  }
}
