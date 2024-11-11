# N : 1 ~ N번 까지 번호, M : 공을 바꾸는 번호

a, b = map(int, input().split())


hello = [] # [1, 2, 3, 4, 5]
for i in range(a):
    c = i + 1
    hello.append(c)
    
hello_1 = hello[:] # [1, 2, 3, 4, 5]

for i in range(b):
    q, w = map(int, input().split()) # 1, 2
    hello_1[q-1] = hello[w-1]
    hello_1[w-1] = hello[q-1]
    hello[w-1] = hello_1[w-1]
    hello[q-1] = hello_1[q-1]

for i in hello_1:
    print(i, end = " ")