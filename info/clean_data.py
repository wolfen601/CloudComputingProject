import pandas

acm = pandas.read_csv('acm.csv')
acm.columns = ['Acronym', 'FullName']
acm['Organization'] = 'ACM'
ieee = pandas.read_csv('ieee.csv')
ieee.columns = ['Acronym', 'FullName']
ieee['Organization'] = 'IEEE'
conferences = ieee.append(acm, ignore_index=True)
conferences['Id'] = conferences.index
conferences.to_json('conferences.json', orient='records')
conferences.to_csv('conferences.csv', index=False)
users = pandas.read_csv('users.csv')
users['Id'] = users.index
users.columns = ['User', 'Password', 'Id']
users.to_json('users.json',orient='records')
