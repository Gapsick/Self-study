a = int(input())
b = []
for _ in range(a):
    input_a = list(input())
    c = input_a[0]
    d = input_a[len(input_a)-1]
    for_list = [c, d]
    b.append(for_list)

for i in b:
    for j in i:
        print(j, end= "")
    print()