import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { UnauthorizedError } from '../common/errors/types/UnauthorizedError';
import { UserEntity } from './entities/user.entity';
import { NotFoundError } from '../common/errors/types/NotFoundError';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.repository.create(createUserDto);
  }

  public async findAll() {
    // throw new UnauthorizedError('Não autorizado');
    return this.repository.findAll();
  }

  public async findOne(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne(id);

    if (!user) {
      throw new NotFoundError('Usuario nao encontrado.');
    }

    return user;
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    return this.repository.update(id, updateUserDto);
  }

  public async remove(id: string) {
    return this.repository.remove(id);
  }
}
