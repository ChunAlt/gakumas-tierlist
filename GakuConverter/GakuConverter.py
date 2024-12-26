import csv
import pandas as pd

# Path to the CSV file
file_path = 'GakuStats.csv'

# Initialize an empty list to hold the dictionary-like strings
output_list = []

# Read the CSV file
#with open(file_path, mode='r', newline='', encoding='utf-8-sig') as csv_file:
#    reader = csv.DictReader(csv_file)  # Automatically uses the header row as keys
#    for row in reader:
#        formatted_row = {
#            f'"{key}"': f'"{value}"' if key == "char_name" else value
#            for key, value in row.items()
#        }
#        output_list.append(formatted_row)

# Join the strings with commas
        
#output = str(output_list).replace("'", "")

        
#with open("output.txt", "w",encoding='utf-8') as file:
#    file.write(output)
#print('done')

output = pd.read_csv(file_path)

output2 = output.to_dict(orient='records')
output3 = ', '.join(
    ['{' + ', '.join([f'"{key}": "{value}"' if isinstance(value, str) else f'"{key}": {value}' for key, value in row.items()]) + '}' for row in output2]
)
print(output3)

with open('output.txt', 'w') as file:
    file.write(output3)
print("done")