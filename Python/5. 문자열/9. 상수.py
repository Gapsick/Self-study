a, b = input().split(" ")

list_a = []
list_b = []


for i in a:
    list_a.append(i)

for i in b:
    list_b.append(i)

list_a_1 = list_a[ : : -1]
list_a_2 = list_b[ : : -1]

a = ""
for i in list_a_1:
    a += i

b = ""
for i in list_a_2:
    b += i

if int(a) > int(b):
    print(a)
elif int(a) < int(b):
    print(b)