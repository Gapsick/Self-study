a = [0, 1, 2, 3, 4, 5] # 1, 2, 5, 4, 3
# b = [5, 4, 3, 2, 1]
def calculate(arg_start, arg_end):
    b = a[arg_end: arg_start - 1: -1]
    
    count = 0
    for i in range(arg_start, arg_end+1):
        a[i] = b[count]
        count += 1
    
    return a

print(calculate(3, 5))