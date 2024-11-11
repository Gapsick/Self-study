# dial_list = ["a", "a", "ABC", "CDF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"]
# input_word = input()
# num = 0
# for i in dial_list:
#     for j in i:
#         if j in input_word:
#             num += dial_list.index(i) + 1

# print(num)
# ["ABC"], ["CDF"], ["GHI"], ["JKL"], ["MNO"], ["PQRS"], ["TUV"], ["WXYZ"]

dial_list = ["a", "a", "ABC", "CDF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"]
input_word = input()
num = 0
for i in input_word:
    check_flag = True
    while check_flag:
        for j in dial_list:
            for k in j:
                if i == k:
                    num += dial_list.index(j) + 1
                    check_flag = False

print(num)