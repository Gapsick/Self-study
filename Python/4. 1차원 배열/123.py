def calculate(arg_start, arg_end):
    b = list_a[arg_end: arg_start - 1: -1]
    
    count = 0
    for i in range(arg_start, arg_end+1):
        list_a[i] = b[count]
        count += 1
    
    return a


a, b = map(int, input().split())

list_a = []
for i in range(0, a+1):
    list_a.append(i)

for i in range(b):
    c, d = map(int, input().split())
    calculate(c, d)

for i in list_a:
    if i != 0:
        print(i, end = " ")