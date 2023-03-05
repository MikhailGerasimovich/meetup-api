import { DataType, Model, Table } from 'sequelize-typescript';
import { Column } from 'sequelize-typescript';
import { v4 } from 'uuid';

interface MeetupCreationAttrs {
  title: string;
  description: string;
  tags: string[];
  date: Date;
  place: string;
}

@Table({ tableName: 'meetups', timestamps: false })
export class Meetup extends Model<Meetup, MeetupCreationAttrs> {
  @Column({ type: DataType.STRING, primaryKey: true, unique: true, defaultValue: v4() })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  tags: string[];

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  place: string;
}
