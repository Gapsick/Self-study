a = int(input())

word_list = []
word_list_1 = []
for i in range(a):
    word_list_1 = []
    b, c = input().split()
    for j in b:
        for k in c:
            word = k * int(j)
            word_list_1.append(word)

    word_list.append(word_list_1)

for i in word_list:
    for j in i:
        print(j, end = "")
    print()