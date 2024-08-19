input_word = input().upper()
number_list = []
check_word = []

for word in input_word:
    count = 0
    if word not in check_word:
        for word_1 in input_word:
            if word == word_1:
                count += 1
        else:
            number_list.append(count)
            check_word.append(word)
    else:
        number_list.append(-1)
        check_word.append("x")

print(number_list)
print(check_word)

for i in number_list:
    if i != -1:
        count = 0
        for j in number_list:
            if i == j:
                count += 1
        else:
            if count >= 2:
                print("?")
                break
else:
    max_num = max(number_list)
    # print(max_num)
    find_index = number_list.index(max_num)
    # print(find_index)
    print(check_word[find_index])