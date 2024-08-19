# N: 정수 갯수, X: 비교 정수, A: 값

N, X = map(int, input().split())
A = list(map(int, input().split()))
A_1 = A[:N]

for i in A_1:
    if i < X:
        print(i, end = " ")