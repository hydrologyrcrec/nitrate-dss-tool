from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
from dotenv import load_dotenv
import os
from db import get_db_connection
from auth.routes import auth_bp
from middleware import register_middleware
import requests


load_dotenv()

app = Flask(__name__)

CORS(app,
     supports_credentials=True,
     resources={r"*": {"origins": ["http://localhost:3000", os.environ.get("WEBSITE_URL")]}})

register_middleware(app)

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

        # Query for groundwater stations
        gw_query = """
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
        cursor.execute(gw_query, (polygon_wkt,))
        gw_rows = cursor.fetchall()

        groundwater_stations = {}
        for row in gw_rows:
            station_id = str(row['station_id']) 
            if station_id not in groundwater_stations:
                groundwater_stations[station_id] = {
                    "id": station_id,
                    "name": row['station_name'],
                    "lng": row['st_x'],
                    "lat": row['st_y'],
                    "links": []
                }

            if row['link_label']:
                groundwater_stations[station_id]["links"].append({
                    "label": row['link_label'],
                    "url": row['link_url'],
                    "type": row['data_type']
                })

        # Query for surface water stations
        sw_query = """
        SELECT sw.station_id, sw.station_name,
               ST_X(sw.station_location::geometry),
               ST_Y(sw.station_location::geometry),
               swl.link_label, swl.link_url, swl.data_type
        FROM surface_water_stations sw
        LEFT JOIN sw_data_links swl ON sw.station_id = swl.station_id
        WHERE ST_Within(
            sw.station_location::geometry,
            ST_GeomFromText(%s, 4326)
        );
        """
        cursor.execute(sw_query, (polygon_wkt,))
        sw_rows = cursor.fetchall()

        surface_water_stations = {}
        for row in sw_rows:
            station_id = str(row['station_id']) 
            if station_id not in surface_water_stations:
                surface_water_stations[station_id] = {
                    "id": station_id,
                    "name": row['station_name'],
                    "lng": row['st_x'],
                    "lat": row['st_y'],
                    "links": []
                }

            if row['link_label']:
                surface_water_stations[station_id]["links"].append({
                    "label": row['link_label'],
                    "url": row['link_url'],
                    "type": row['data_type']
                })

        return jsonify({
            "ground_water": list(groundwater_stations.values()),
            "surface_water": list(surface_water_stations.values())
        })

    except Exception as e:
        print("Query failed:", e)
        return jsonify({"error": "Query execution failed"}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/geojson/<path:filename>', methods=['GET'])
def serve_geojson(filename):
    s3_url = f"{os.environ.get('S3_URL')}/geojson/{filename}"
    s3_response = requests.get(s3_url)

    if s3_response.status_code != 200:
        return jsonify({"error": "File not found"}), 404

    return Response(s3_response.content, mimetype='application/json')

@app.route('/api/tiffs/<path:filename>', methods=['GET'])
def serve_tiff(filename):
    s3_url = f"{os.environ.get('S3_URL')}/tiffs/{filename}"
    s3_response = requests.get(s3_url)

    if s3_response.status_code != 200:
        return jsonify({"error": "Raster file not found"}), 404

    return Response(s3_response.content, content_type='application/octet-stream')

@app.route('/api/fert-man-data', methods=['GET'])
def fert_management():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cursor = conn.cursor()

        # Query for fertilizer management data
        fm_query = """
        SELECT *
        FROM fertilizer_management_data
        """
        cursor.execute(fm_query)
        fm_rows = cursor.fetchall()
        return jsonify(fm_rows)

    except Exception as e:
        print("Query failed:", e)
        return jsonify({"error": "Query execution failed"}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/activate', methods=['GET'])
def activate_server():
    print("Server activated successfully")
    return jsonify({ "message": "Server activated successfully" })


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5008))
    app.run(host="0.0.0.0", port=port, debug=True)
