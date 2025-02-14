import { defineStore } from "pinia";

export const useCounterStore = defineStore ("counter", {
    state: () => ({
        count: 0    // 상태 (State) 정의
    }),
    actions: {
        increment() {
            this.count++;   // 데이터를 변경하는 액션 (Action)
        },
        decrement() {
            this.count--;
        }
    }
})