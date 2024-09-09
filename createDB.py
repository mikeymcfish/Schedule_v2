import os
import psycopg2.pool
import json
from tqdm import tqdm

try:
    # Create a connection pool
    pool = psycopg2.pool.SimpleConnectionPool(0, 80, os.environ['DATABASE_URL'])

    # Get a connection from the pool
    conn = pool.getconn()
    cur = conn.cursor()

    # Function to create the table
    def create_table():
        cur.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            date DATE,
            day_letter VARCHAR(10),
            week_color VARCHAR(10),
            school_level VARCHAR(20),
            class_name VARCHAR(20),
            start_time TIME,
            duration INT,
            period_color VARCHAR(20),
            minor INT,
            title VARCHAR(100),
            note TEXT
        )
        """)
        conn.commit()

    create_table()

    # Function to read JSON files
    def read_json(file_path):
        with open(file_path, 'r') as file:
            return json.load(file)

    custom_events = read_json('src/customEvents.json')
    dates_v2 = read_json('src/dates-v2.json')["DateScheduleWeek"]
    daily_schedule = read_json('src/daily.json')
    colors_data = read_json('src/colors.json')["SchoolWeek"]

    color_mapping = {
        'O': 'Orange',
        'V': 'Violet',
        'R': 'Red',
        'B': 'Blue',
        'G': 'Green',
        'Y': 'Yellow',
        'T': 'Tan',
        'P': 'Pink',
        'W': 'White'  # Default for unmatched colors
    }

    # Helper function to find class color and extract minor
    def find_class_color(day, school_type, period):
        for entry in colors_data:
            if entry["Day"] == day and entry["Type"] == school_type:
                for schedule in entry["Schedule"]:
                    if schedule["Period"] == period:
                        return schedule["Class"]
        return "W"  # Default color if no match found

    # Function to extract color letter and minor value
    def extract_color_and_minor(full_color, school_level):
        if full_color == "W":
            return "White", 0
        
        color_letter = full_color[0].upper()  # Take the first letter as the color
        color_name = color_mapping.get(color_letter, "White")
        if school_level == "UpperSchool" and len(full_color) > 1 and full_color[2].isdigit():
            minor = int(full_color[2])
        else:
            minor = 0
        return color_name, minor

    # Function to insert data into the database
    def insert_event(event_data):
        cur.execute("""
        INSERT INTO events (
            date, day_letter, week_color, school_level, class_name, 
            start_time, duration, period_color, minor, title, note
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            event_data["date"], event_data["day_letter"], event_data["week_color"], 
            event_data["school_level"], event_data["class_name"], event_data["start_time"], 
            event_data["duration"], event_data["period_color"], event_data["minor"], 
            event_data["title"], event_data["note"]
        ))
        conn.commit()

    # Insert custom events
    for event in tqdm(custom_events, desc="Custom Events"):
        event_data = {
            "date": event["date"],
            "day_letter": None,
            "week_color": None,
            "school_level": None,
            "class_name": None,
            "start_time": event.get("startTime", "00:00:00"),
            "duration": event.get("duration", 0),
            "period_color": event.get("color", "none"),
            "minor": 0,
            "title": event.get("title", ""),
            "note": None
        }
        insert_event(event_data)

    # Insert scheduled events
    for date_info in tqdm(dates_v2, desc="Scheduled Events"):
        date = date_info["date"]
        day_letter = date_info["day"]
        week_color = date_info["color"]
        note = date_info.get("note", "")

        # Insert UpperSchool schedule
        for period in daily_schedule["UpperSchool"]:
            class_name = period["className"]
            full_color = find_class_color(day_letter, "US", class_name)
            period_color, minor = extract_color_and_minor(full_color, "UpperSchool")
            event_data = {
                "date": date,
                "day_letter": day_letter,
                "week_color": week_color,
                "school_level": "UpperSchool",
                "class_name": class_name,
                "start_time": period["startTime"],
                "duration": period["duration"],
                "period_color": period_color,
                "minor": minor,
                "title": None,
                "note": note
            }
            insert_event(event_data)

        # Insert MiddleSchool schedule
        for period in daily_schedule["MiddleSchool"]:
            class_name = period["className"]
            full_color = find_class_color(day_letter, "MS", class_name)
            period_color, minor = extract_color_and_minor(full_color, "MiddleSchool")
            event_data = {
                "date": date,
                "day_letter": day_letter,
                "week_color": week_color,
                "school_level": "MiddleSchool",
                "class_name": class_name,
                "start_time": period["startTime"],
                "duration": period["duration"],
                "period_color": period_color,
                "minor": minor,
                "title": None,
                "note": note
            }
            insert_event(event_data)

    # Close cursor and connection
    cur.close()
    pool.putconn(conn)
    pool.closeall()

except Exception as e:
    print(f"An error occurred: {e}")