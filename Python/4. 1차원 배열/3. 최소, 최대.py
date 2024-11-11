# N개의 정수, 최대 최소값 구하기
N = int(input())
A = list(map(int, input().split()))
A_1 = A[0:N+1]

a = max(A_1)
b = min(A_1)

print(b, a)