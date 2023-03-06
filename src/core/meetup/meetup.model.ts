import { BelongsToMany, DataType, Model, Table } from 'sequelize-typescript';
import { Column } from 'sequelize-typescript';
import { v4 } from 'uuid';
import { Tag } from '../tag/tag.model';

interface MeetupCreationAttrs {
  title: string;
  description: string;
  date: Date;
  place: string;
}

@Table({ tableName: 'meetups', timestamps: false })
export class Meetup extends Model<Meetup, MeetupCreationAttrs> {
  @Column({ type: DataType.UUID, primaryKey: true, unique: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  place: string;

  @BelongsToMany(() => Tag, 'meetups_tags', 'meetup_id', 'tag_id')
  tags: Tag[];
}
