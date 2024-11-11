# N개의 정수 정수 v가 몇개
# 첫째 줄 정수의 개수
# 둘째 줄 정수가 공백 구분
# 셋째 줄 찾으려는 v

count = 0
a = int(input())
b = list(map(int, input().split()))
c = int(input())

for i in b:
    if i == c:
        count += 1

print(count)