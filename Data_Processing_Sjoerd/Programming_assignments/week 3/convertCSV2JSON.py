import json
import csv

# storing rows of csv in list
with open('Sacramento_real_estate_transactions.csv') as f:
    reader = csv.DictReader(f)
    rows = list(reader)
    
# creating new file and storing the information in json format
with open('Sacramento_sales_2008.json', 'w') as f:
    json.dump(rows, f)
