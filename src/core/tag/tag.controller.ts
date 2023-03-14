import { Controller, Post, HttpCode, Body, Get, Put, Delete, Param, Query } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ReadAllResult } from 'src/common/read-all/types/read-all.types';
import { CreateTagDto } from './dto/create-tag.dto';
import { ReadAllTagDto } from './dto/read-all-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './tag.model';
import { TagService } from './tag.service';
import { FrontendTag } from './types/tag.types';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() createTagDto: CreateTagDto): Promise<FrontendTag> {
    const tag = await this.tagService.create(createTagDto);
    return new FrontendTag(tag);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async readAll(@Query() readAllTagDto: ReadAllTagDto): Promise<ReadAllResult<FrontendTag>> {
    const { pagination, sorting, ...filter } = readAllTagDto;
    const tags = await this.tagService.readAll({ pagination, sorting, filter });

    return {
      totalRecordsNumber: tags.totalRecordsNumber,
      entities: tags.entities.map((tag: Tag) => new FrontendTag(tag)),
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async readById(@Param('id') id: string): Promise<FrontendTag> {
    const tag = await this.tagService.readOneBy({ id });
    return new FrontendTag(tag);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<FrontendTag> {
    const updatedTag = await this.tagService.update(id, updateTagDto);
    return new FrontendTag(updatedTag);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string): Promise<void> {
    await this.tagService.delete(id);
  }
}
