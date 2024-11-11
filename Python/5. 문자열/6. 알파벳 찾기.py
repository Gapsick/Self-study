# whole_list = [-1 for _ in range(26)]

# alpha_list = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q",\
#     "r", "s", "t", "u", "v", "w", "x", "y", "z"]

# word = input()

# one_word_count = 0
# for one_word in word: # b, a, e, k, j, o, o, n
#     alpha_list_count = 0
#     for alpha in alpha_list:
#         if one_word == alpha:
#             if whole_list[alpha_list_count] == -1:
#                 whole_list[alpha_list_count] = one_word_count
#         alpha_list_count += 1
#     one_word_count += 1

# print(whole_list)

input_word = input()
alpha = "abcdefghijklmnopqrstuvwxyz"

for al in alpha:
    if al in input_word:
        print(input_word.index(al), end = " ")
    else:
        print(-1, end = " ")