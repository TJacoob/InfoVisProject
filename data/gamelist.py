#!/usr/bin/python
# -*- coding: latin-1 -*-

import csv

games = [];
country = ["US","PT"];

for i in [0,9]:
	for c in country:
		with open('country/'+c+'/'+str(i)+'.csv', 'rb') as f:
			reader = csv.reader(f)
			for row in reader:
				if ( row[1] not in games ):
					games.append(row[1]);

games.pop(0);
with open("output.csv",'wb') as resultFile:
    wr = csv.writer(resultFile, dialect='excel')
    for item in games:
     	wr.writerow([item,])

print len(games);