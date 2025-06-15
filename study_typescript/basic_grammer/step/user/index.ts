// index.ts
import { User } from './user';
import { Board } from './board';

const user1 = new User(1, 'alice', 'alice@example.com');
const user2 = new User(2, 'bob', 'bob@example.com', true);

const post1 = new Board(1, 'Hello', 'This is my first post', user1);
const post2 = new Board(2, 'Admin Notice', 'Please read carefully', user2);

console.log(user1.getInfo());      // alice (alice@example.com)
console.log(user2.getInfo());      // bob (bob@example.com)
console.log(post1.getSummary());   // [Hello] by alice
console.log(post2.getSummary());   // [Admin Notice] by bob
