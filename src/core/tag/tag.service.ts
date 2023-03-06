import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagOptions } from './dto/tag.options';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './tag.model';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag) private readonly tagRepository: typeof Tag) {}

  public async create(createTagDto: CreateTagDto) {}

  public async readAllBy(tagOptions: TagOptions) {}

  public async readOneBy(tagOptions: TagOptions) {}

  public async update(id: string, updateTagDto: UpdateTagDto) {}

  public async delete(id: string) {}
}
