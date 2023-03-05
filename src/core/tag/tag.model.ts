import { Table, Model, Column, DataType, BelongsToMany } from 'sequelize-typescript';
import { v4 } from 'uuid';
import { Meetup } from '../meetup/meetup.model';

interface TagCreationAttrs {
  name: string;
}

@Table({ tableName: 'tags', timestamps: false })
export class Tag extends Model<Tag, TagCreationAttrs> {
  @Column({ type: DataType.STRING, primaryKey: true, unique: true, defaultValue: v4() })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @BelongsToMany(() => Meetup, 'meetups_tags', 'tag_id', 'meetup_id')
  meetups: Meetup[];
}
