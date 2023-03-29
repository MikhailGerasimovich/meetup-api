import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ReadAllResult } from 'src/common/read-all/types/read-all.types';
import { UserService } from './user.service';
import { FrontendUser } from './types/user.types';
import { ReadAllUserDto } from './dto/read-all-user.dto';
import { User } from './user.model';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async readAll(
    @Query() readAllUserDto: ReadAllUserDto,
  ): Promise<ReadAllResult<FrontendUser>> {
    const { pagination, sorting, ...filter } = readAllUserDto;

    const users = await this.userService.readAll({ pagination, sorting, filter });
    return {
      totalRecordsNumber: users.totalRecordsNumber,
      entities: users.entities.map((user: User) => new FrontendUser(user)),
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async readById(@Param('id') id: string): Promise<FrontendUser> {
    const user = await this.userService.readOneById(id);
    return new FrontendUser(user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<FrontendUser> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return new FrontendUser(updatedUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }
}
