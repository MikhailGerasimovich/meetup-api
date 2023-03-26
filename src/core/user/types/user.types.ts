import { User } from '../user.model';

export class FrontendUser {
  public id: string;
  public login: string;
  public email: string;
  public roles: {
    id: string;
    name: string;
  }[];

  constructor(user: User) {
    this.id = user.id;
    this.login = user.login;
    this.email = user.email;
    this.roles = user.roles.map((role) => ({
      id: role.id,
      name: role.name,
    }));
  }
}
