import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      select: ['id', 'firstName', 'lastName', 'email'],
    });
  }

  async findOneByOrFail(
    where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ) {
    try {
      return this.userRepository.findOneByOrFail(where);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async store(data: CreateUserDto) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.findOneByOrFail({ id });
    this.userRepository.merge(user, data);
    return this.userRepository.save(user);
  }

  async destroy(id: number) {
    await this.userRepository.findOneByOrFail({ id });
    this.userRepository.softDelete({ id });
  }
}
