import csv
import json

with open('Sacramento_real_estate_transactions.csv') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

with open('test.json', 'w') as f:
    json.dump(rows, f)
