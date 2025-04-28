import requests
import folium
from geopy.geocoders import Nominatim

def find_hospitals_osm(postal_code, radius=4500):
    """Find nearby hospitals using OpenStreetMap Overpass API based on Indian postal code"""
    # Convert postal code to coordinates (restricted to India)
    geolocator = Nominatim(user_agent="geo_locator")
    location = geolocator.geocode(f"{postal_code}, India")  # Ensure search is limited to India

    if not location:
        return f"Invalid postal code: {postal_code}. Please enter a valid Indian pincode."

    latitude, longitude = location.latitude, location.longitude

    # Overpass API query for hospitals
    overpass_url = "http://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json];
    (
      node["amenity"="hospital"](around:{radius},{latitude},{longitude});
      way["amenity"="hospital"](around:{radius},{latitude},{longitude});
      relation["amenity"="hospital"](around:{radius},{latitude},{longitude});
    );
    out center;
    """

    response = requests.get(overpass_url, params={"data": overpass_query})
    data = response.json()

    hospitals = []
    for element in data.get("elements", []):
        name = element.get("tags", {}).get("name", "Unknown Hospital")
        lat = element.get("lat", element.get("center", {}).get("lat"))
        lon = element.get("lon", element.get("center", {}).get("lon"))

        if lat and lon:
            hospitals.append({"name": name, "latitude": lat, "longitude": lon})

    return hospitals if hospitals else f"No hospitals found near postal code: {postal_code}."


def generate_map(hospitals):
    """Generate an interactive map with hospital locations"""
    if not isinstance(hospitals, list) or len(hospitals) == 0:
        print("No hospitals found.")
        return

    # Compute average latitude and longitude for map centering
    avg_lat = sum(h["latitude"] for h in hospitals) / len(hospitals)
    avg_lon = sum(h["longitude"] for h in hospitals) / len(hospitals)

    # Create map centered at average location
    m = folium.Map(location=[avg_lat, avg_lon], zoom_start=13)

    # Add hospital markers
    for hospital in hospitals:
        folium.Marker(
            [hospital["latitude"], hospital["longitude"]],
            popup=hospital["name"],
            tooltip="Click for Hospital Name",
            icon=folium.Icon(color="red")
        ).add_to(m)

    # Save map as HTML
    map_file = "map.html"
    m.save(map_file)
    print(f"✅ Map saved as {map_file}. Open this file in your browser to view the locations.")





if __name__ == "__main__":
# 125001, 462001, 110001, 560001, 600001, 700001, 800001, 900001
    postal_code = "462001"  # Example: New Delhi postal code

    hospitals = find_hospitals_osm(postal_code)

    if isinstance(hospitals, list):
        generate_map(hospitals)
        for hospital in hospitals:
            print(f"🏥 Name: {hospital['name']}\n🌍 Location: {hospital['latitude']}, {hospital['longitude']}\n")
    else:
        print(hospitals)

