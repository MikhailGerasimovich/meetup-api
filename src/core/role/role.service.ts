import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { defaultPagination } from 'src/common/constants/pagination.constants';
import { defaultSorting } from 'src/common/constants/sorting.constants';
import { ReadAllResult } from 'src/common/read-all/types/read-all.types';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/upadate-role.dto';
import { RoleOptions } from './dto/role.options';
import { Role } from './role.model';
import { IReadAllRoleOptions } from './types/read-all-role.options';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private readonly roleRepository: typeof Role) {}

  public async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.readOneBy({ name: createRoleDto.name });
    if (existingRole) {
      throw new BadRequestException(`role with name=${createRoleDto.name} already exists`);
    }
    const role = await this.roleRepository.create(createRoleDto);
    return role;
  }

  public async readAll(readOptions: IReadAllRoleOptions): Promise<ReadAllResult<Role>> {
    const pagination = readOptions.pagination ?? defaultPagination;
    const sorting = readOptions.sorting ?? defaultSorting;

    const { count, rows } = await this.roleRepository.findAndCountAll({
      limit: pagination.size,
      offset: pagination.offset,
      order: [[sorting.column, sorting.direction]],
    });

    return {
      totalRecordsNumber: count,
      entities: rows,
    };
  }

  public async readOneBy(roleOptions: RoleOptions): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { ...roleOptions } });
    return role;
  }

  public async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const existingRole = await this.readOneBy({ id });
    if (!existingRole) {
      throw new NotFoundException(`role with id=${id} not found`);
    }

    const similarNameRole = await this.readOneBy({ name: updateRoleDto.name });
    if (similarNameRole) {
      throw new BadRequestException(`role with name=${updateRoleDto.name} already exists`);
    }

    const [nemberUpdatedRows, updatedRoles] = await this.roleRepository.update(updateRoleDto, {
      where: { id },
      returning: true,
    });

    return updatedRoles[0];
  }

  public async delete(id: string): Promise<void> {
    const existingRole = await this.readOneBy({ id });
    if (!existingRole) {
      throw new NotFoundException(`role with id=${id} not found`);
    }
    await this.roleRepository.destroy({ where: { id } });
  }
}
