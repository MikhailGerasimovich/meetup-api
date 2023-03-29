import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { ReadAllResult } from 'src/common/read-all/types/read-all.types';
import { defaultPagination } from 'src/common/constants/pagination.constants';
import { defaultSorting } from 'src/common/constants/sorting.constants';
import { User } from './user.model';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IReadAllUserOptions, UserFiltration } from './types/read-all-user.options';
import { Role } from '../role/role.model';
import { UserOptions } from './dto/user.options';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly roleService: RoleService,
  ) {}

  public async create(createUserDto: CreateUserDto, transaction: Transaction): Promise<User> {
    const role = await this.roleService.readOneBy({ name: 'USER' });
    if (!role) {
      throw new BadRequestException(`this operation is not available at the moment`);
    }

    await this.throwErrorIfSimilarLoginUserExists(createUserDto.login);
    await this.throwErrorIfSimilarEmailUserExists(createUserDto.email);

    const user = await this.userRepository.create(createUserDto, { transaction });
    await user.$add('roles', [role], { transaction }); //в этом месте транзакция падает
    user.roles = [role];
    delete user.password;

    return user;
  }

  public async readAll(readOptions: IReadAllUserOptions): Promise<ReadAllResult<User>> {
    const pagination = readOptions.pagination ?? defaultPagination;
    const sorting = readOptions.sorting ?? defaultSorting;
    const filter = UserFiltration.getLikeFilters(readOptions.filter);

    const { count, rows } = await this.userRepository.findAndCountAll({
      where: { ...filter.userFilters },
      include: [
        {
          model: Role,
          all: true,
        },
      ],
      attributes: {
        exclude: ['password'],
      },
      distinct: true,
      limit: pagination.size,
      offset: pagination.offset,
      order: [[sorting.column, sorting.direction]],
    });

    for (let user of rows) {
      user.roles = await user.$get('roles');
    }

    return {
      totalRecordsNumber: count,
      entities: rows,
    };
  }

  public async readOneBy(userOptions: UserOptions): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { ...userOptions },
      include: { all: true, through: { attributes: [] } },
    });
    return user;
  }

  public async readOneById(id: string): Promise<User> {
    const user = await this.readOneBy({ id });
    if (!user) {
      throw new NotFoundException(`user with id=${id} not found`);
    }
    return user;
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.readOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException(`user with id=${id} not found`);
    }

    await this.throwErrorIfSimilarLoginUserExists(updateUserDto.login);
    await this.throwErrorIfSimilarEmailUserExists(updateUserDto.email);

    const [nemberUpdatedRows, updatedUsers] = await this.userRepository.update(updateUserDto, {
      where: { id },
      returning: true,
    });

    delete updatedUsers[0].password;
    updatedUsers[0].roles = existingUser.roles;

    return updatedUsers[0];
  }

  public async delete(id: string): Promise<void> {
    const existingUser = await this.readOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException(`user with id=${id} not found`);
    }
    await this.userRepository.destroy({ where: { id } });
  }

  private async throwErrorIfSimilarLoginUserExists(login: string): Promise<void> {
    if (!login) return;

    const similarLoginUser = await this.readOneBy({ login });
    if (similarLoginUser) {
      throw new BadRequestException(`user with login=${login} already exists`);
    }
  }

  private async throwErrorIfSimilarEmailUserExists(email: string): Promise<void> {
    if (!email) return;

    const similarEmailUser = await this.readOneBy({ email });
    if (similarEmailUser) {
      throw new BadRequestException(`user with email=${email} already exists`);
    }
  }
}
