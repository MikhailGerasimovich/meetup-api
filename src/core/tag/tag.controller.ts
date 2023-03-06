import { Controller, Post, HttpCode, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() createTagDto: CreateTagDto) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async readAll() {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async readById(@Param('id') id: string) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {}

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(@Param('id') id: string) {}
}
