// board.ts
import { User } from './user';

export class Board {
  constructor(
    public id: number,
    public title: string,
    public content: string,
    public author: User,
  ) {}

  getSummary(): string {
    return `[${this.title}] by ${this.author.username}`;
  }
}
