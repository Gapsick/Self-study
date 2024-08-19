hi = []
for i in range(10):
    a = int(input())
    b = a % 42
    if b not in hi:
        hi.append(b)

print(len(hi))