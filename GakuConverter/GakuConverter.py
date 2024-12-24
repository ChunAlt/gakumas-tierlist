import csv

# Path to the CSV file
file_path = 'GakuStats.csv'

# Initialize an empty list to hold the dictionary-like strings
output_list = []

# Read the CSV file
with open(file_path, mode='r', newline='', encoding='utf-8-sig') as csv_file:
    reader = csv.DictReader(csv_file)  # Automatically uses the header row as keys
    for row in reader:
        formatted_row = {
            f'"{key}"': f'"{value}"' if key == "char_name" else value
            for key, value in row.items()
        }
        output_list.append(formatted_row)

# Join the strings with commas
#print(output_list)
output = str(output_list).replace("'", "")
print(output)
        
with open("output.txt", "w") as file:
    file.write(output)
print('done')