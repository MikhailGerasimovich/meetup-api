import { Role } from '../role.model';

export class FrontendRole {
  public id: string;
  public name: string;

  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
  }
}
