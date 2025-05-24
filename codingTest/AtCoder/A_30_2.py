w, h, n = map(int, input().split())
x, y = map(int, input().split())

for _ in range(n):
    a, b = input().split()
    b = int(b)

    if a == "U":      # 위로 → y 증가
        y += b
    elif a == "D":    # 아래로 → y 감소
        y -= b
    elif a == "R":    # 오른쪽 → x 증가
        x += b
    elif a == "L":    # 왼쪽 → x 감소
        x -= b

    # 맵 범위 밖으로 나가면 되돌리기 (wrap-around)
    x = (x + w) % w
    y = (y + h) % h

print(x, y)
