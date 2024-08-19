# 주사위 세개
# 같은 눈이 3개 -> 10,000원 + (같은 눈) * 1000원
# 같은 눈이 2개 -> 1,000원 + (같은 눈) * 100원
# 모두 다른 눈 -> (가장 큰 눈) * 100원

a, b, c = map(int, input().split())

money = 0

if a == b == c:
    money = 10000 + (a * 1000)

elif a == b:
    money = 1000 + (a * 100)
elif b == c:
    money = 1000 + (b * 100)
elif a == c:
    money = 1000 + (c * 100)

elif a != b != c:
    if a > b and a > c:
        money = a * 100
    elif b > c and b > a:
        money = b * 100
    elif c > a and c > b:
        money = c * 100

print(money)