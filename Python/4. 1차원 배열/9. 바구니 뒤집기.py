# N : 바구니 갯수, M: 바구니의 순서를 역순

a, b = map(int, input().split())

list_a = []

for i in range(1, a+1):
    list_a.append(i)

list_b = list_a[:]

for hi in range(b):

    c, d = map(int, input().split())
    
    
    if (d // 2) % 2 == 0:
        f =  (d//2)
    else:
        f = int(d//2)
    
    if a == d:
        if c != 1:
            for i in range(c-1, f+1):
                list_a[i] = list_b[d-i] 
                list_a[d-i] = list_b[i]
                list_b[i] = list_a[i]
                list_b[d-i] = list_a[d-i]   
        if c == 1:
            list_a = list_b[ : : -1]
            list_b = list_a
            
            
    elif d - c == 1:
        for i in range(c, d):
            list_a[i-1] = list_b[i] 
            list_a[d-1] = list_b[c-1]
            list_b[i-1] = list_a[i-1]
            list_b[i] = list_a[i]

    elif d == c:
        continue
    
    else:
        for i in range(c, f+1):
            list_a[i-1] = list_b[d-i] 
            list_a[d-i] = list_b[i-1]
            list_b[i-1] = list_a[i-1]
            list_b[d-i] = list_a[d-i] 
        
for i in list_b:
    print(i, end = " ")