# 공 넣기
# N = 바구니 갯수, M = 넣는 횟수

N, M = map(int, input().split())

a = [0] * N

for i in range(M):
    b, c, d = map(int, (input().split()))
    for i in range(b-1, c):
        a[i] = d

for i in a:
    print(i, end = " ")