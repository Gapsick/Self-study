# 첫째 줄 부터 9번째 줄까지 한 줄에 하나의 자연수가 주워짐
# 첫째 줄에 최대값을 출력
# 둘째 줄에 최대값이 몇번째 수인지를 출력


a = [int(input()) for _ in range(9)]

b = max(a)

count = 1
for i in a:
    if i == b:
        break
    count += 1

print(b, count)