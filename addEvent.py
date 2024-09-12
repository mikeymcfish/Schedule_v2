import json
from datetime import datetime
from dateutil import parser
import os

def parse_date(date_string):
    try:
        date = parser.parse(date_string)
        return date.strftime("%Y-%m-%d")
    except ValueError:
        print("Invalid date format. Please try again.")
        return None

def add_event():
    # Get user input
    while True:
        date = parse_date(input("Enter the date (e.g., 'next tuesday', 'tomorrow', '2023-05-15'): "))
        if date:
            break

    start_time = input("Enter the start time (HH:MM): ")
    duration = int(input("Enter the duration in minutes: "))
    title = input("Enter the event title: ")

    # Create the event dictionary
    event = {
        "date": date,
        "startTime": start_time,
        "duration": duration,
        "title": title,
        "color": "#ffffff"
    }

    # Load existing events or create an empty list
    if os.path.exists('customevents.json'):
        with open('customevents.json', 'r') as f:
            events = json.load(f)
    else:
        events = []

    # Add the new event
    events.append(event)

    # Save the updated events list
    with open('customevents.json', 'w') as f:
        json.dump(events, f, indent=2)

    print("Event added successfully!")

if __name__ == "__main__":
    add_event()