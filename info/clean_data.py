import pandas

acm = pandas.read_csv('acm.csv')
acm.columns = ['Acronym', 'Name']
acm['Organization'] = 'ACM'
ieee = pandas.read_csv('ieee.csv')
ieee.columns = ['Acronym', 'Name']
ieee['Organization'] = 'IEEE'
conferences = ieee.append(acm, ignore_index=True)
conferences['ID'] = conferences.index
conferences['Rating'] = 0
conferences.to_json('conferences.json', orient='records')
conferences.to_csv('conferences.csv', index=False)
users = pandas.read_csv('users.csv')
users.to_json('users.json',orient='records')
