from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from map_service import find_hospitals_osm, generate_map

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from the frontend

@app.route('/submit', methods=['POST'])
def submit():
    try:
        data = request.get_json()
        postal_code = data.get("postal_code", "")

        if not postal_code or not postal_code.isdigit() or len(postal_code) != 6:
            return jsonify({"error": "Invalid postal code"}), 400

        hospitals = find_hospitals_osm(postal_code)

        if isinstance(hospitals, list):
            generate_map(hospitals)
            return jsonify({"message": "Map generated successfully", "map_url": "http://127.0.0.1:5500/map_service/map.html"}), 200
        else:
            return jsonify({"error": "No hospitals found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
