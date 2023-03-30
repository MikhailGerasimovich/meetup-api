import { Meetup } from '../meetup.model';

export class FrontendMeetup {
  public id: string;
  public title: string;
  public description: string;
  public date: Date;
  public place: string;
  public tags: {
    id: string;
    name: string;
  }[];
  public organizer: {
    id: string;
    login: string;
    email: string;
  };

  constructor(meetup: Meetup) {
    this.id = meetup.id;
    this.title = meetup.title;
    this.description = meetup.description;
    this.date = meetup.date;
    this.place = meetup.place;
    this.tags = meetup.tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }));
    this.organizer = {
      id: meetup.organizer.id,
      login: meetup.organizer.login,
      email: meetup.organizer.email,
    };
  }
}
