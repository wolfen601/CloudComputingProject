import pandas

acm = pandas.read_csv('acm.csv')
acm.columns = ['Acronym', 'Conference']
acm['Conference Host'] = 'ACM'
ieee = pandas.read_csv('ieee.csv')
ieee.columns = ['Acronym', 'Conference']
ieee['Conference Host'] = 'IEEE'
conferences = ieee.append(acm, ignore_index=True)
conferences.to_json('conferences.json',orient='records')

users = pandas.read_csv('users.csv')
users.to_json('users.json',orient='records')
