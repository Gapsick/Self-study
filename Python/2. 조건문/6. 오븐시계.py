# A : 시간, B : 분, C : 요리하는데 필요한 시간
hour, minute = map(int, input().split())


cook_time = int(input())
cal = minute + cook_time
div = int(cal // 60)


if div > 0:
    cal = cal - (60 * div)
    hour += div
if hour >= 24:
    hour = hour % 24

print(hour, cal)