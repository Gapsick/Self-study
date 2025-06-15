// user.ts
export class User {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public isAdmin: boolean = false,
  ) {}

  getInfo(): string {
    return `${this.username} (${this.email})`;
  }
}
