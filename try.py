import re

# your list
lst = ['sawdtr5', 'life8', 'abc123', 'xyz456']
numbers = [int(num) for s in lst for num in re.findall('\d+', s)]
lst = [re.sub('\d+', '', s) for s in lst]
dic = dict(zip(lst, numbers))

print(dic)


print(numbers)
