people = int(input())

hi = [0 for a in range(people)]
print_list = [1 for a in range(people)]


for i in range(people):
    input_score = int(input())
    
    hi[i] = input_score

a = 0
b = 0

while True:
    
    # 종료조건
    if(a == people):
        break

    if (hi[a] < hi[b]):
        print_list[a] += 1
        
    b+=1

    if (b == people):
        a += 1
        b = 0
    
for x in print_list:
    print(x)