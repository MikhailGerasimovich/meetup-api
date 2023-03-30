import { title } from 'process';
import { User } from '../user.model';

export class FrontendUser {
  public id: string;
  public login: string;
  public email: string;
  public roles: {
    id: string;
    name: string;
  }[];
  public createdMeetups: {
    id: string;
    title: string;
    description: string;
    date: Date;
    place: string;
    tags: {
      id: string;
      name: string;
    }[];
  }[];

  constructor(user: User) {
    this.id = user.id;
    this.login = user.login;
    this.email = user.email;
    this.roles = user.roles.map((role) => ({
      id: role.id,
      name: role.name,
    }));
    this.createdMeetups = user.createdMeetups.map((meetup) => ({
      id: meetup.id,
      title: meetup.title,
      description: meetup.description,
      date: meetup.date,
      place: meetup.place,
      tags: meetup.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    }));
  }
}
