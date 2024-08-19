# a = [1, 1, 2]

# b = set(a)

# print(b)

# abcd = []
# for i in b:
#     abcd.append(a.count(i))

# print(abcd)


# print(max(a))

input_word = input().upper()

input_set_word = set(input_word) # m, s, i, p

count_list = []

for word in input_set_word:
    count_list.append(input_word.count(word))

print(count_list) # 4 4 1 1

max_index = max(count_list) # 4

if count_list.count(max_index) >= 2:
    print("?")

# else:
#     print(input_set_word[count_list.index(max_index)])