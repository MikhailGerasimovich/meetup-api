import { BelongsTo, BelongsToMany, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Column } from 'sequelize-typescript';
import { Tag } from '../tag/tag.model';
import { User } from '../user/user.model';

interface MeetupCreationAttrs {
  title: string;
  description: string;
  date: Date;
  place: string;
  organizer_id: string;
}

@Table({ tableName: 'meetups', timestamps: false, createdAt: false, updatedAt: false })
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

  @BelongsTo(() => User, 'organizer_id')
  organizer: User;

  @BelongsToMany(() => User, 'meetups_users', 'meetup_id', 'user_id')
  members: User[];
}
