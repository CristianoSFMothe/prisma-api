import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  public async findAll(): Promise<UserEntity[]> {
    return this.prisma.user.findMany();
  }

  public async findOne(id: string): Promise<UserEntity> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  public async remove(id: string): Promise<UserEntity> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
