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
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { TransactionParam } from 'src/common/decorators/transaction.decorator';
import { ReadAllResult } from 'src/common/read-all/types/read-all.types';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FrontendUser } from './types/user.types';
import { ReadAllUserDto } from './dto/read-all-user.dto';
import { User } from './user.model';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(TransactionInterceptor)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createUserDto: CreateUserDto,
    @TransactionParam() transaction: Transaction,
  ): Promise<FrontendUser> {
    const user = await this.userService.create(createUserDto, transaction);
    return new FrontendUser(user);
  }

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
    const user = await this.userService.readOneBy({ id });
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
