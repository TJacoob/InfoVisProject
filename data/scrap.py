#!/usr/bin/python
# -*- coding: latin-1 -*-

import requests
from bs4 import BeautifulSoup
import csv


games = [];
values = [];
name = "";
hours = "";

with open('output.csv', 'rb') as f:
	reader = csv.reader(f)
	for row in reader:
		games.append(row[0].lower());

for i in range(51321,55000):
	#print i ;
	name = "";
	hours = "";

	req = requests.get("https://howlongtobeat.com/game.php?id="+str(i))
	#req = requests.get("https://howlongtobeat.com/game.php?id=578")
	soup = BeautifulSoup(req.text, "lxml")

	for link in soup.findAll('div', { "class" : "profile_header shadow_text" }):
		name = link.text.encode('utf-8').lstrip()
		print (str(i)+" : "+name) ;

	if ( name[:-1].lower() in games ):
		#print(soup.findAll('li', { "class" : "short" }));
		for link in soup.findAll('div', { "class" : "game_times" })[0].findAll('div')[0]:
			#print(link)
			hours = link.encode('utf-8').split()[0];
			#print(hours);
		values.append([name[:-1],hours]);
		print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\nAdded: "+ name[:-1]+" | Hours: "+hours);

print values;

with open("values.csv", "wb") as f:
    writer = csv.writer(f)
    writer.writerows(values)