# M : 최대 값
num = int(input())
list_score = []
score = list(map(int, input().split()))
max_score = max(score)
for i in score:
    a = (i / max_score) * 100
    list_score.append(a)

a = 0
for i in list_score:
    a += i
a = a / num
print(a)