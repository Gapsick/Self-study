w, h, n = map(int, input().split())
x, y = map(int, input().split())

for i in range(n):
    a, b = input().split()
    b = int(b)

    if (a == "U"):
        b = b % h
        y += b
    elif (a == "D"):
        b = b % h
        y = y - b
    elif (a == "R"):
        x = x % w
        x += b
    else:   # L
        x = x % w
        x -= b


    print(x, y)


    if (x >= w-1):
        x = x - w

    if (x < 0):
        x = w + x

    if (y >= h):
        y = y - h

    if (y < 0):
        y = y + h


print(x, y)