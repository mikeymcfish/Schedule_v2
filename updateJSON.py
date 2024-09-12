import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

SERVICE_ACCOUNT_JSON = os.environ['GOOGLE_SERVICE_ACCOUNT_JSON']
service_account_info = json.loads(SERVICE_ACCOUNT_JSON)

credentials = service_account.Credentials.from_service_account_info(
    service_account_info,
    scopes=['https://www.googleapis.com/auth/spreadsheets']
)

sheets_service = build('sheets', 'v4', credentials=credentials)

SPREADSHEET_ID = '1F2LaEcC2kPHzucywgx-h6LdDwvVVanlP-YNMzcn9esY'
RANGE = 'events!A2:E'

result = sheets_service.spreadsheets().values().get(
    spreadsheetId=SPREADSHEET_ID,
    range=RANGE
).execute()

formatted_values = [
    {
        "date": value[0],
        "startTime": value[1].strip(),
        "duration": int(value[2]),
        "title": value[3],
        "color": value[4]
    }
    for value in result.get('values', [])
]
with open('src/customEvents.json', 'w') as f:
    json.dump(formatted_values, f, indent=4)
print(json.dumps(formatted_values, indent=4))