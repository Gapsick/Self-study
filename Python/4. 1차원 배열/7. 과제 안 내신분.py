a = [i for i in range(1, 31)]

for _ in range(28):
    b = int(input())
    a[b-1] = " "

a_1 = []
for i in a:
    if i != " ":
        a_1.append(i)

print(min(a_1))
print(max(a_1))