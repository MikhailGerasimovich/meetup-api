import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { User } from '../user/user.model';

interface RoleCreationAttrs {
  name: string;
}

@Table({ tableName: 'roles', timestamps: false, createdAt: false, updatedAt: false })
export class Role extends Model<Role, RoleCreationAttrs> {
  @Column({ type: DataType.UUID, primaryKey: true, unique: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @BelongsToMany(() => User, 'users_roles', 'role_id', 'user_id')
  users: User[];
}
