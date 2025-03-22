const app = createApp(App);     // 불변 객체
let count = 0;                  // 변할 수 있는 값

items.foreach(item => console.log(item));

const { name, age } = props;

const [a, b] = [1, 2];

const user = { name: '성식', age: 25};
const newUser = {...user, role: 'admin' };

const greeting = `안녕하세요, ${name}님`;

const name1 = 'seongsik';
const user1 = { name1 };

export const state = reactive({ count: 0 });

import { state } from './store';

const getData = async () => {
    const res = await fetch('/api/data');
    data.value = await res.json();
};