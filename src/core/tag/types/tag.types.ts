import { Tag } from '../tag.model';

export class FrontendTag {
  public id: string;
  public name: string;

  constructor(tag: Tag) {
    this.id = tag.id;
    this.name = tag.name;
  }
}
