from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from db import get_db_connection
from auth.routes import auth_bp

load_dotenv()

app = Flask(__name__)
CORS(app,
     supports_credentials=True,
     resources={r"/api/*": {"origins": ["http://localhost:3000", os.environ.get("WEBSITE_URL")]}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])

app.register_blueprint(auth_bp, url_prefix="/api/auth")

@app.route("/api/stations-in-polygon", methods=["POST"])
def get_stations():
    data = request.get_json()
    coordinates = data.get("coordinates")

    if not coordinates:
        return jsonify({"error": "No coordinates provided"}), 400

    if coordinates[0] != coordinates[-1]:
        coordinates.append(coordinates[0])

    coords_str = ", ".join(f"{lng} {lat}" for lng, lat in coordinates)
    polygon_wkt = f"POLYGON(({coords_str}))"

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
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

        station_map = {}
        for row in rows:
            station_id = str(row['station_id']) 
            if station_id not in station_map:
                station_map[station_id] = {
                    "id": station_id,
                    "name": row['station_name'],
                    "lng": row['st_x'],
                    "lat": row['st_y'],
                    "links": []
                }

            if row['link_label']:
                station_map[station_id]["links"].append({
                    "label": row['link_label'],
                    "url": row['link_url'],
                    "type": row['data_type']
                })

        return jsonify(list(station_map.values()))
    
    except Exception as e:
        print("Query failed:", e)
        return jsonify({"error": "Query execution failed"}), 500
    
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5008))
    app.run(host="0.0.0.0", port=port, debug=True)