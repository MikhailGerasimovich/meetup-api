import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { ReadAllResult } from 'src/common/read-all/types/read-all.types';
import { CreateRoleDto } from './dto/create-role.dto';
import { ReadAllRoleDto } from './dto/read-all-role.dto';
import { UpdateRoleDto } from './dto/upadate-role.dto';
import { Role } from './role.model';
import { RoleService } from './role.service';
import { FrontendRole } from './types/role.types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() createRoleDtp: CreateRoleDto): Promise<FrontendRole> {
    const role = await this.roleService.create(createRoleDtp);
    return new FrontendRole(role);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async readAll(
    @Query() readAllRoleDto: ReadAllRoleDto,
  ): Promise<ReadAllResult<FrontendRole>> {
    const { pagination, sorting } = readAllRoleDto;

    const roles = await this.roleService.readAll({ pagination, sorting });
    return {
      totalRecordsNumber: roles.totalRecordsNumber,
      entities: roles.entities.map((role: Role) => new FrontendRole(role)),
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async readById(@Param('id') id: string): Promise<FrontendRole> {
    const role = await this.roleService.readOneById(id);
    return new FrontendRole(role);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<FrontendRole> {
    const updatedRole = await this.roleService.update(id, updateRoleDto);
    return new FrontendRole(updatedRole);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string): Promise<void> {
    await this.roleService.delete(id);
  }
}
