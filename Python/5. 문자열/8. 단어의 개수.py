user_input = input()

count = 0
a = " "
for i in user_input:
    if a != " " and i == " ":
        count += 1
    a = i
else:
    if a != ' ':
        count += 1
print(count)