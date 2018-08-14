#convert to array
import csv
coords = ""
with open('locations.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',' )
    coords += "["
    #print ("[")
    
    for row in spamreader:
        #print("[" + row[0] + ", " + row[1] + "]")
        if(spamreader.line_num %3 != 0 and (row[0] != 18.8811247 and row[0] != 18.8806924) ) :
            print(spamreader.line_num)
            coords += "[" + row[0] + ", " + row[1] + "],"
    coords += "]"
    #print("]")

file = open("testfile.txt","w") 
file.write(coords)
file.close()