import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagOptions } from './dto/tag.options';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './tag.model';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag) private readonly tagRepository: typeof Tag) {}

  public async create(createTagDto: CreateTagDto): Promise<Tag> {
    const existingTag = await this.readOneBy({ name: createTagDto.name });
    if (existingTag) {
      throw new BadRequestException(`tag with name=${createTagDto.name} already exists`);
    }

    const tag = await this.tagRepository.create(createTagDto);
    return tag;
  }

  public async readAllBy(tagOptions: TagOptions): Promise<Tag[]> {
    const tags = await this.tagRepository.findAll({
      where: { ...tagOptions },
      include: { all: true },
    });
    return tags;
  }

  public async readOneBy(tagOptions: TagOptions): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { ...tagOptions },
      include: { all: true },
    });
    return tag;
  }

  public async update(id: string, updateTagDto: UpdateTagDto) {
    const existingTag = await this.readOneBy({ id });
    if (!existingTag) {
      throw new NotFoundException(`tag with id=${id} not found`);
    }

    const sameNameTag = await this.readOneBy({ name: updateTagDto.name });
    if (sameNameTag) {
      throw new BadRequestException(`tag with name=${updateTagDto.name} already exists`);
    }

    await this.tagRepository.update(updateTagDto, { where: { id } });

    const updatedTag = await this.readOneBy({ id });
    return updatedTag;
  }

  public async delete(id: string): Promise<void> {
    const existingTag = await this.readOneBy({ id });
    if (!existingTag) {
      throw new NotFoundException(`tag with id=${id} not found`);
    }
    await this.tagRepository.destroy({ where: { id } });
  }
}
