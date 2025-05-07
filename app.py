from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os

load_dotenv() 

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_UNAME"),
    password=os.getenv("DB_PW"),  
    host=os.getenv("DB_HOST_NAME"),
    port=os.getenv("DB_PORT")
)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/stations-in-polygon", methods=["POST"])
def get_stations():
    data = request.get_json()
    coordinates = data.get("coordinates")  # Should be [[lng, lat], [lng, lat], ...]
    
    if not coordinates:
        return jsonify({"error": "No coordinates provided"}), 400

    # Close the polygon (make sure first and last are the same)
    if coordinates[0] != coordinates[-1]:
        coordinates.append(coordinates[0])

    # Convert list of coords into WKT (Well-Known Text) format
    coords_str = ", ".join(f"{lng} {lat}" for lng, lat in coordinates)
    polygon_wkt = f"POLYGON(({coords_str}))"

    cursor = conn.cursor()
    query = """
    SELECT s.station_id, s.station_name,
           ST_X(s.station_location::geometry),
           ST_Y(s.station_location::geometry),
           dl.link_label, dl.link_url, dl.data_type
    FROM stations s
    LEFT JOIN data_links dl ON s.station_id = dl.station_id
    WHERE ST_Within(
        s.station_location::geometry,
        ST_GeomFromText(%s, 4326)
    );
    """
    cursor.execute(query, (polygon_wkt,))
    rows = cursor.fetchall()
    print("rows", rows)
    # Group station data
    station_map = {}

    for row in rows:
        station_id = row[0]
        if station_id not in station_map:
            station_map[station_id] = {
                "id": station_id,
                "name": row[1],
                "lng": row[2],
                "lat": row[3],
                "links": []
            }

        if row[4]:  # If this station has a data link
            station_map[station_id]["links"].append({
                "label": row[4],
                "url": row[5],
                "type": row[6]
            })

    return jsonify(list(station_map.values()))

if __name__ == "__main__":
    app.run(debug=True, port=os.getenv("PORT") or 5000)