import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Meetup } from '../meetup/meetup.model';
import { Role } from '../role/role.model';

interface UserCreationAttrs {
  login: string;
  password: string;
  email: string;
}

@Table({ tableName: 'users', timestamps: false, createdAt: false, updatedAt: false })
export class User extends Model<User, UserCreationAttrs> {
  @Column({ type: DataType.UUID, primaryKey: true, unique: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  login: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @BelongsToMany(() => Role, 'users_roles', 'user_id', 'role_id')
  roles: Role[];

  @HasMany(() => Meetup, 'organizer_id')
  createdMeetups: Meetup[];

  @BelongsToMany(() => Meetup, 'meetups_users', 'user_id', 'meetup_id')
  meetups: Meetup[];
}
