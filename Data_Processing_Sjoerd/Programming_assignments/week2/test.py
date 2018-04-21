import csv

data = [[1,'more width cell',3],[4,5,6],[7,8,9]]
item_length = len(data[0])

with open('KNMI_20171231.txt', 'wb') as test_file:
  file_writer = csv.writer(test_file)
  for i in range(item_length):
    file_writer.writerow([x[i] for x in data])
