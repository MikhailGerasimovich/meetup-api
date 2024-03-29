import { Table, Model, Column, DataType, BelongsToMany } from 'sequelize-typescript';
import { Meetup } from '../meetup/meetup.model';

interface TagCreationAttrs {
  name: string;
}

@Table({ tableName: 'tags', timestamps: false, createdAt: false, updatedAt: false })
export class Tag extends Model<Tag, TagCreationAttrs> {
  @Column({ type: DataType.UUID, primaryKey: true, unique: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @BelongsToMany(() => Meetup, 'meetups_tags', 'tag_id', 'meetup_id')
  meetups: Meetup[];
}
