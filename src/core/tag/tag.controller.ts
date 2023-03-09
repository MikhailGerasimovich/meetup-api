import { Controller, Post, HttpCode, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagService } from './tag.service';
import { Tag } from './tag.model';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    const tag = await this.tagService.create(createTagDto);
    return tag;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async readAll(): Promise<Tag[]> {
    const tags = await this.tagService.readAllBy({});
    return tags;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async readById(@Param('id') id: string): Promise<Tag> {
    const tag = await this.tagService.readOneBy({ id });
    return tag;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto): Promise<Tag> {
    const updatedTag = await this.tagService.update(id, updateTagDto);
    return updatedTag;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string): Promise<void> {
    await this.tagService.delete(id);
  }
}
